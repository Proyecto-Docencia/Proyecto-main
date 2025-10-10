// Extrae texto plano desde un PDF usando pdfjs-dist
// Carga el worker desde CDN para evitar configuraciones adicionales de bundler
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist';

GlobalWorkerOptions.workerSrc = 'https://unpkg.com/pdfjs-dist@4.4.168/build/pdf.worker.mjs' as any;

export async function extractPdfText(pdfUrl: string): Promise<string> {
  const loadingTask = getDocument(pdfUrl);
  const pdf = await loadingTask.promise;
  const pages: string[] = [];
  for (let p = 1; p <= pdf.numPages; p++) {
    const page = await pdf.getPage(p);
    const content = await page.getTextContent();
    const text = content.items
      .map((item: any) => ('str' in item ? item.str : (item as any).textContent || ''))
      .join(' ');
    pages.push(text);
  }
  await pdf.destroy();
  return pages.join('\n\n').replace(/\s+/g, ' ').trim();
}

// Devuelve un array con el texto de cada página (menos normalización para conservar posibles cortes de títulos)
export async function extractPdfPages(pdfUrl: string): Promise<string[]> {
  const loadingTask = getDocument(pdfUrl);
  const pdf = await loadingTask.promise;
  const pages: string[] = [];
  for (let p = 1; p <= pdf.numPages; p++) {
    const page = await pdf.getPage(p);
    const content = await page.getTextContent();
    // Unir items con espacios pero conservar saltos artificiales en puntos
    const text = content.items
      .map((item: any) => ('str' in item ? item.str : (item as any).textContent || ''))
      .join(' ')
      .replace(/\s+/g, ' ') // colapsar múltiples espacios
      .trim();
    pages.push(text);
  }
  await pdf.destroy();
  return pages;
}

// Estructura básica por página con algo de preservación de formato en HTML.
// - Junta palabras por líneas usando la coordenada Y (transform[5])
// - Detecta títulos (MAYÚSCULAS) y listas básicas (•, -, 1.)
// - Aplica <strong>/<em> según fontFamily contenga Bold/Italic/Oblique
// - Subrayado: intento heurístico si la fontFamily incluye 'Underline' (limitado)
export async function extractPdfStructured(pdfUrl: string): Promise<string[]> {
  const loadingTask = getDocument(pdfUrl);
  const pdf = await loadingTask.promise;
  const pagesHtml: string[] = [];

  for (let p = 1; p <= pdf.numPages; p++) {
    const page = await pdf.getPage(p);
    const content: any = await page.getTextContent();
    const styles = content.styles || {};

    type Item = { str: string; transform: number[]; fontName: string; hasEOL?: boolean };
    const items: Item[] = content.items || [];
    if (!items.length) { pagesHtml.push(''); continue; }

    // Agrupar por líneas usando Y (transform[5])
    const lines: { y: number; items: Item[] }[] = [];
    const yThreshold = 2.5; // tolerancia
    for (const it of items) {
      const y = Array.isArray(it.transform) ? it.transform[5] : 0;
      let line = lines.find(l => Math.abs(l.y - y) < yThreshold);
      if (!line) { line = { y, items: [] }; lines.push(line); }
      line.items.push(it);
    }
    // Ordenar líneas de arriba a abajo y palabras por X
    lines.sort((a,b)=> b.y - a.y); // coord PDF: y mayor suele estar más arriba
    for (const l of lines) {
      l.items.sort((a,b)=> (a.transform?.[4]||0) - (b.transform?.[4]||0));
    }

    // Construir líneas de texto con marcas simples
    const htmlLines: string[] = [];
    for (const l of lines) {
      const parts: string[] = [];
      for (const it of l.items) {
        const text = (it.str || '').trim();
        if (!text) continue;
        const st = styles[it.fontName] || {};
        const fam: string = String(st.fontFamily || '');
        const isBold = /bold|black|heavy/i.test(fam);
        const isItalic = /italic|oblique/i.test(fam);
        const isUnderline = /underline/i.test(fam); // heurística limitada
        // No escapamos aquí caracteres que ya vienen codificados (&quot;), pues son texto del PDF.
        let t = text
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;');
        if (isBold) t = `<strong>${t}</strong>`;
        if (isItalic) t = `<em>${t}</em>`;
        if (isUnderline) t = `<u>${t}</u>`;
        parts.push(t);
      }
      const lineText = parts.join(' ');
      if (lineText) htmlLines.push(lineText);
    }

    // Eliminar números de página solitarios al inicio ("1", "p.2", romanos)
    const stripTags = (s: string) => s.replace(/<[^>]+>/g,'').trim();
    const isPageNumberOnly = (s: string) => {
      const t = stripTags(s);
      return /^(?:p\.?\s*)?\d{1,3}$/.test(t) || /^[ivxlcdm]{1,6}$/i.test(t);
    };
    const htmlLinesCleaned: string[] = [];
    for (let i=0; i<htmlLines.length; i++) {
      const s = htmlLines[i];
      if (i <= 2 && isPageNumberOnly(s)) continue; // descartar cabeceras tipo "1" o "p.2"
      htmlLinesCleaned.push(s);
    }

    // Clasificar en headings, listas y párrafos
    const pageBlocks: string[] = [];
    let listOpen = false;
    const isHeading = (s: string) => {
      const pure = s.replace(/<[^>]+>/g,'').replace(/[^A-Za-zÁÉÍÓÚÜÑ0-9 ]/g,'');
      if (!pure.trim()) return false;
      const upper = pure.replace(/[^A-ZÁÉÍÓÚÜÑ0-9 ]/g,'').length;
      const ratio = upper / pure.length;
      return (ratio > 0.75 && pure.length >= 4 && pure.length <= 140);
    };
    const isList = (s: string) => /^([•\-\u2022]|\d+\.|\d+\))\s+/i.test(s.replace(/<[^>]+>/g,''));

    for (let i=0;i<htmlLinesCleaned.length;i++) {
      const s = htmlLinesCleaned[i];
      if (isHeading(s)) {
        if (listOpen) { pageBlocks.push('</ul>'); listOpen = false; }
        pageBlocks.push(`<h2 style="margin:1rem 0 .25rem; font-size:1.25em">${s}</h2>`);
        continue;
      }
      if (isList(s)) {
        if (!listOpen) { pageBlocks.push('<ul style="margin:.25rem 0 .5rem .9rem; padding:0; list-style:disc">'); listOpen = true; }
        pageBlocks.push(`<li>${s}</li>`);
        continue;
      }
      if (listOpen) { pageBlocks.push('</ul>'); listOpen = false; }
  pageBlocks.push(`<p>${s}</p>`);
    }
    if (listOpen) pageBlocks.push('</ul>');

    pagesHtml.push(pageBlocks.join('\n'));
  }
  await pdf.destroy();
  return pagesHtml;
}

// escapeHtml ya no se usa (las líneas se sanitan en línea)
