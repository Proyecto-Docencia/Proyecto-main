import React, { useEffect, useMemo, useRef, useState } from 'react';
import { extractPdfStructured } from '../utils/pdfExtract';
import { Loader2 } from 'lucide-react';
import '../css/PdfViewer.css';

interface PdfHtmlViewerProps {
  pdfUrl?: string;
  inlineHtml?: string;
  className?: string;
}

// Versión simplificada sin índice ni búsqueda.
const PdfHtmlViewer: React.FC<PdfHtmlViewerProps> = ({ pdfUrl, inlineHtml, className }) => {
  const [pages, setPages] = useState<string[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Detect a global dark class on the document (used by the app) and apply locally
    try {
      const doc = document.documentElement;
      setIsDark(doc.classList.contains('dark'));
    } catch (e) {
      setIsDark(false);
    }

    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      setPages(null);
      try {
        // Si se proporciona inlineHtml preferimos mostrarlo inmediatamente y no depender del PDF
        if (inlineHtml) {
          if (cancelled) return;
          setPages([inlineHtml]);
          return;
        }
        if (!pdfUrl) {
          setPages([]);
          return;
        }
        const p = await extractPdfStructured(pdfUrl);
        if (cancelled) return;
        setPages(p);
      } catch (e) {
        if (cancelled) return;
        setError('No se pudo leer el PDF.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [pdfUrl, inlineHtml]);

  const safePages = useMemo(() => pages ?? [], [pages]);

  const themeClass = isDark ? 'dark' : '';

  return (
    <div className={`pdf-html-viewer-wrapper pdf-theme ${themeClass} ${className || ''}`} style={{ width: '100%' }}>
      <div
        ref={containerRef}
        style={{
          marginTop: '0',
          width: '100%',
          overflowY: 'visible',
          background: 'transparent',
          border: 'none',
          borderRadius: 0,
          boxShadow: 'none',
          padding: '0',
          display: 'block',
          fontFamily: 'Georgia, "Times New Roman", serif',
        }}
      >
        {loading && (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-3" />
            <p style={{ fontSize: '1.05rem', fontWeight: 500 }}>Cargando contenido...</p>
          </div>
        )}

        {error && !loading && (
          <div style={{ color: '#dc2626', padding: '1rem', background: '#fee2e2', borderRadius: 8, fontSize: '1rem' }}>
            ⚠️ {error}
          </div>
        )}

        {!loading && !error && safePages && safePages.map((html, idx) => (
          <SimplePage key={idx} page={idx + 1} html={html} />
        ))}
      </div>
    </div>
  );
};

const SimplePage: React.FC<{ page: number; html: string }> = ({ page, html }) => {
  const cleanHtml = html
    .replace(/<p[^>]*>\s*(Página|página|PÁGINA|Page|page)\s+\d+\s*<\/p>/gi, '')
    .replace(/>\s*(Página|página|PÁGINA|Page|page)\s+\d+\s*</gi, '><');

  return (
    <section
      data-page={page}
      style={{
        marginBottom: '1.5rem',
        width: '100%',
        maxWidth: '100%',
        background: 'transparent',
        padding: '0',
        borderRadius: 0,
        boxShadow: 'none',
        border: 'none',
      }}
    >
      <div className="pdf-content" dangerouslySetInnerHTML={{ __html: cleanHtml.replace(/(\n|\r)+/g, ' ') }} />
    </section>
  );
};

export default PdfHtmlViewer;
