import React, { useEffect, useMemo, useRef, useState } from 'react';
import { extractPdfStructured } from '../utils/pdfExtract';
import { Loader2 } from 'lucide-react';
import '../css/PdfViewer.css';

interface PdfHtmlViewerProps {
  pdfUrl: string;
  className?: string;
}

// Versión simplificada sin índice ni búsqueda.

const PdfHtmlViewer: React.FC<PdfHtmlViewerProps> = ({ pdfUrl, className }) => {
  const [pages, setPages] = useState<string[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Cargar páginas
  useEffect(() => {
    let cancelled = false;
    (async() => {
      setLoading(true); setError(null); setPages(null);
      try {
        const p = await extractPdfStructured(pdfUrl);
        if (cancelled) return;
        setPages(p);
      } catch (e) {
        if (cancelled) return; setError('No se pudo leer el PDF.');
      } finally { if (!cancelled) setLoading(false); }
    })();
    return () => { cancelled = true; };
  }, [pdfUrl]);

  // Las páginas ya vienen como HTML seguro desde extractPdfStructured
  const safePages = useMemo(() => pages ?? [], [pages]);

  return (
    <div className={`pdf-html-viewer-wrapper ${className || ''}`} style={{ width:'100%' }}>
      <div ref={containerRef} style={{ 
        marginTop:'1rem', 
        maxHeight:'80vh', 
        overflowY:'auto', 
        background:'linear-gradient(to bottom, #ffffff 0%, #f8fafc 100%)', 
        border:'1px solid #e2e8f0', 
        borderRadius:12, 
        boxShadow:'0 4px 20px -5px rgba(0,0,0,0.1)', 
        padding:'2rem 2.5rem', 
        display:'flex', 
        flexDirection:'column', 
        alignItems:'center',
        fontFamily:'Georgia, "Times New Roman", serif'
      }}>
          {loading && (
            <div style={{ textAlign:'center', padding:'3rem', color:'#64748b' }}>
              <Loader2 className='w-8 h-8 animate-spin mx-auto mb-3'/> 
              <p style={{ fontSize:'1.1rem', fontWeight:500 }}>Cargando contenido...</p>
            </div>
          )}
          {error && !loading && (
            <div style={{ color:'#dc2626', padding:'2rem', background:'#fee2e2', borderRadius:12, fontSize:'1.05rem' }}>
              ⚠️ {error}
            </div>
          )}
          {!loading && !error && safePages && safePages.map((html, idx) => (
            <SimplePage key={idx} page={idx+1} html={html} />
          ))}
        </div>
    </div>
  );
};

const SimplePage: React.FC<{ page:number; html:string; }> = ({ page, html }) => {
  // Limpiar cualquier referencia residual a "Página N" del HTML
  const cleanHtml = html
    .replace(/<p[^>]*>\s*(Página|página|PÁGINA|Page|page)\s+\d+\s*<\/p>/gi, '')
    .replace(/>\s*(Página|página|PÁGINA|Page|page)\s+\d+\s*</gi, '><');

  return (
    <section data-page={page} style={{ 
      marginBottom:'2rem', 
      width:'100%', 
      maxWidth:900,
      background:'#ffffff',
      padding:'2rem 2.5rem',
      borderRadius:8,
      boxShadow:'0 1px 3px rgba(0,0,0,0.05)',
      border:'1px solid #f1f5f9'
    }}>
      <div 
        className="pdf-content"
        dangerouslySetInnerHTML={{ __html: cleanHtml.replace(/(\n|\r)+/g,' ') }} 
      />
      {/* Separador sutil entre secciones */}
      {page > 0 && page < 999 && (
        <hr style={{ 
          marginTop:'2.5rem',
          border:'none',
          height:'1px',
          background:'linear-gradient(to right, transparent, #e2e8f0 20%, #e2e8f0 80%, transparent)'
        }}/>
      )}
    </section>
  );
};

// escapeRegExp eliminado al simplificar.

export default PdfHtmlViewer;
