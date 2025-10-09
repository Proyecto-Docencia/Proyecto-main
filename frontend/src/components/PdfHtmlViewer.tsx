import React, { useEffect, useMemo, useRef, useState } from 'react';
import { extractPdfStructured } from '../utils/pdfExtract';
import { Loader2 } from 'lucide-react';

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
  <div ref={containerRef} style={{ marginTop:'0.5rem', maxHeight:'70vh', overflowY:'auto', background:'#fff', border:'1px solid #e2e8f0', borderRadius:12, boxShadow:'0 4px 16px -4px rgba(0,0,0,0.08)', padding:'1.75rem 2.4rem', display:'flex', flexDirection:'column', alignItems:'center' }}>
          {loading && (
            <div style={{ textAlign:'center', padding:'2rem', color:'#64748b' }}>
              <Loader2 className='w-6 h-6 animate-spin mx-auto mb-2'/> Cargando PDF...
            </div>
          )}
          {error && !loading && (
            <div style={{ color:'#dc2626', padding:'1rem' }}>{error}</div>
          )}
          {!loading && !error && safePages && safePages.map((html, idx) => (
            <SimplePage key={idx} page={idx+1} html={html} />
          ))}
        </div>
    </div>
  );
};
const SimplePage: React.FC<{ page:number; html:string; }> = ({ page, html }) => (
  <section data-page={page} style={{ marginBottom:'2.25rem', width:'100%', maxWidth:900 }}>
    <div style={{ fontSize: '1.1rem', lineHeight:1.7, textAlign:'justify' }} dangerouslySetInnerHTML={{ __html: html.replace(/(\n|\r)+/g,' ') }} />
    <hr style={{ marginTop:'1.75rem', border:'none', borderTop:'1px solid #f1f5f9' }} />
  </section>
);

// escapeRegExp eliminado al simplificar.

export default PdfHtmlViewer;
