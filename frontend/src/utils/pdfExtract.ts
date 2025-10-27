// Extrae texto plano desde un PDF usando pdfjs-dist
// Carga el worker desde CDN para evitar configuraciones adicionales de bundler
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist';

GlobalWorkerOptions.workerSrc = 'https://unpkg.com/pdfjs-dist@4.4.168/build/pdf.worker.mjs' as any;

/**
 * Limpia números de página y patrones no deseados
 */
function cleanPageArtifacts(text: string): string {
  return text
    .replace(/^(Página|página|PÁGINA|Page|page)\s+\d+\s*/gim, '')
    .replace(/^\s*\d{1,3}\s*$/gm, '')
    .replace(/\n\s*\d{1,3}\s*\n/g, '\n')
    .trim();
}

/**
 * Une líneas fragmentadas y limpia el texto
 */
function joinFragmentedText(text: string): string {
  return text
    .replace(/(\w)-\s*\n\s*(\w)/g, '$1$2')
    .replace(/([^\n.!?:;])\n([a-záéíóú])/gi, '$1 $2')
    .replace(/\s+/g, ' ')
    .trim();
}

export async function extractPdfText(pdfUrl: string): Promise<string> {
  const loadingTask = getDocument(pdfUrl);
  const pdf = await loadingTask.promise;
  const pages: string[] = [];
  
  for (let p = 1; p <= pdf.numPages; p++) {
    const page = await pdf.getPage(p);
    const content = await page.getTextContent();
    const text = content.items
      .map((item: any) => ('str' in item ? item.str : item.textContent || ''))
      .join(' ');
    pages.push(text);
  }
  
  await pdf.destroy();
  
  let fullText = pages.join('\n\n');
  fullText = cleanPageArtifacts(fullText);
  fullText = joinFragmentedText(fullText);
  
  return fullText;
}

/**
 * Devuelve un array con el texto de cada página
 */
export async function extractPdfPages(pdfUrl: string): Promise<string[]> {
  const loadingTask = getDocument(pdfUrl);
  const pdf = await loadingTask.promise;
  const pages: string[] = [];
  
  for (let p = 1; p <= pdf.numPages; p++) {
    const page = await pdf.getPage(p);
    const content = await page.getTextContent();
    const text = content.items
      .map((item: any) => ('str' in item ? item.str : item.textContent || ''))
      .join(' ')
      .replace(/\s+/g, ' ')
      .trim();
    pages.push(text);
  }
  
  await pdf.destroy();
  return pages;
}

/**
 * Detecta si una línea es un título/encabezado
 */
function isHeadingLine(text: string): boolean {
  const clean = text.replace(/<[^>]+>/g, '').trim();
  if (!clean || clean.length < 3 || clean.length > 150) return false;
  
  const upperCount = (clean.match(/[A-ZÁÉÍÓÚÜÑ]/g) || []).length;
  const letterCount = (clean.match(/[A-Za-záéíóúüñÁÉÍÓÚÜÑ]/g) || []).length;
  
  if (letterCount === 0) return false;
  const upperRatio = upperCount / letterCount;
  
  return upperRatio > 0.7 && clean.length >= 5;
}

/**
 * Detecta si una línea es un item de lista
 */
function isListItem(text: string): boolean {
  const clean = text.replace(/<[^>]+>/g, '').trim();
  return /^([•\-*\u2022]|\d+[.):])\s+/.test(clean);
}

/**
 * Detecta y formatea referencias bibliográficas
 */
function formatBibliographicReferences(text: string): string {
  return text.replace(
    /\(([A-ZÁÉÍÓÚ][a-záéíóúA-ZÁÉÍÓÚ\s.,&]+(?:et al\.)?[,\s]+\d{4}[a-z]?)\)/g,
    '<cite class="reference">($1)</cite>'
  );
}

/**
 * Limpia referencias de ISBN, DOI y otros metadatos
 */
function cleanMetadata(text: string): string {
  return text
    .replace(/,?\s*ISBN:?\s*[\d\s\-]+/gi, '')
    .replace(/,?\s*DOI:?\s*10\.\d+\/[\w\-.]+/gi, '')
    .replace(/,?\s*pp?\.?\s*\d+[\-–]\d+/gi, '')
    .replace(/,?\s*pp\.?\s*\d+/gi, '');
}

/**
 * Escapa caracteres HTML
 */
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Extrae PDF en formato estructurado HTML por páginas con limpieza avanzada e imágenes
 */
export async function extractPdfStructured(pdfUrl: string): Promise<string[]> {
  const loadingTask = getDocument(pdfUrl);
  const pdf = await loadingTask.promise;
  const pagesHtml: string[] = [];

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const content: any = await page.getTextContent();
    const styles = content.styles || {};

    type Item = { 
      str: string; 
      transform: number[]; 
      fontName: string; 
      hasEOL?: boolean;
    };
    
    const items: Item[] = content.items || [];
    
    // Extraer imágenes de la página
    const operatorList = await page.getOperatorList();
    const images: string[] = [];
    
    for (let i = 0; i < operatorList.fnArray.length; i++) {
      if (operatorList.fnArray[i] === 49 || operatorList.fnArray[i] === 85) { // paintImageXObject
        try {
          const imgIndex = operatorList.argsArray[i][0];
          const img = await page.objs.get(imgIndex);
          
          if (img && img.width && img.height) {
            // Crear canvas para convertir imagen a base64
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            if (ctx && img.data) {
              canvas.width = img.width;
              canvas.height = img.height;
              
              // Crear ImageData desde los datos de la imagen
              const imageData = ctx.createImageData(img.width, img.height);
              const data = img.data;
              
              for (let j = 0; j < data.length; j++) {
                imageData.data[j] = data[j];
              }
              
              ctx.putImageData(imageData, 0, 0);
              const imgDataUrl = canvas.toDataURL('image/png');
              images.push(imgDataUrl);
            }
          }
        } catch (e) {
          // Ignorar errores de extracción de imágenes individuales
          console.warn('No se pudo extraer imagen:', e);
        }
      }
    }
    
    if (!items.length && images.length === 0) { 
      pagesHtml.push(''); 
      continue; 
    }

    // Agrupar items por líneas usando coordenada Y
    const lines: { y: number; items: Item[] }[] = [];
    const yThreshold = 2.5;
    
    for (const item of items) {
      const y = Array.isArray(item.transform) ? item.transform[5] : 0;
      let line = lines.find(l => Math.abs(l.y - y) < yThreshold);
      if (!line) {
        line = { y, items: [] };
        lines.push(line);
      }
      line.items.push(item);
    }

    // Ordenar líneas de arriba a abajo
    lines.sort((a, b) => b.y - a.y);
    
    // Ordenar items dentro de cada línea por X
    for (const line of lines) {
      line.items.sort((a, b) => (a.transform?.[4] || 0) - (b.transform?.[4] || 0));
    }

    // Construir líneas de texto con formato
    const textLines: string[] = [];
    
    for (const line of lines) {
      const parts: string[] = [];
      
      for (const item of line.items) {
        let text = (item.str || '').trim();
        if (!text) continue;

        const style = styles[item.fontName] || {};
        const fontFamily: string = String(style.fontFamily || '');
        
        const isBold = /bold|black|heavy/i.test(fontFamily);
        const isItalic = /italic|oblique/i.test(fontFamily);

        // Escapar HTML
        text = escapeHtml(text);

        // Aplicar formato
        if (isBold && !isItalic) {
          text = `<strong>${text}</strong>`;
        } else if (isItalic && !isBold) {
          text = `<em>${text}</em>`;
        } else if (isBold && isItalic) {
          text = `<strong><em>${text}</em></strong>`;
        }

        parts.push(text);
      }

      const lineText = parts.join(' ').trim();
      if (lineText) {
        textLines.push(lineText);
      }
    }

    // Filtrar números de página y patrones no deseados
    const cleanedLines: string[] = [];
    for (let i = 0; i < textLines.length; i++) {
      const line = textLines[i];
      const plainText = line.replace(/<[^>]+>/g, '').trim();
      
      // Saltar números de página solitarios al inicio
      if (i < 3 && /^\d{1,3}$/.test(plainText)) {
        continue;
      }
      
      // Saltar patrones de "Página N"
      if (/^(página|page)\s+\d+$/i.test(plainText)) {
        continue;
      }
      
      cleanedLines.push(line);
    }

    // Construir HTML estructurado
    const htmlBlocks: string[] = [];
    let inList = false;

    // Insertar imágenes al inicio si existen
    if (images.length > 0) {
      images.forEach((imgData, idx) => {
        htmlBlocks.push(`
          <figure>
            <img 
              src="${imgData}" 
              alt="Imagen ${idx + 1} de la página ${pageNum}"
              loading="lazy"
            />
            <figcaption>Figura ${idx + 1}</figcaption>
          </figure>
        `.trim());
      });
    }

    for (const line of cleanedLines) {
      // Limpiar metadatos y formatear referencias
      let processedLine = cleanMetadata(line);
      processedLine = formatBibliographicReferences(processedLine);
      
      if (!processedLine.trim()) continue;

      if (isHeadingLine(processedLine)) {
        if (inList) {
          htmlBlocks.push('</ul>');
          inList = false;
        }
        
        htmlBlocks.push(`<h2>${processedLine}</h2>`);
        
      } else if (isListItem(processedLine)) {
        if (!inList) {
          htmlBlocks.push('<ul>');
          inList = true;
        }
        
        const cleanedItem = processedLine.replace(/^([•\-*\u2022]|\d+[.):]\s*)/, '').trim();
        htmlBlocks.push(`<li>${cleanedItem}</li>`);
        
      } else {
        if (inList) {
          htmlBlocks.push('</ul>');
          inList = false;
        }
        
        // Párrafo normal - los estilos están en PdfViewer.css
        htmlBlocks.push(`<p>${processedLine}</p>`);
      }
    }

    if (inList) {
      htmlBlocks.push('</ul>');
    }

    pagesHtml.push(htmlBlocks.join('\n'));
  }

  await pdf.destroy();
  return pagesHtml;
}
