import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getMaterialById } from '../data/materials';
import '../css/Materials.css';
import { FileDown, ArrowLeft, Headphones } from 'lucide-react';
import PdfHtmlViewer from '../components/PdfHtmlViewer';

const MaterialDetail: React.FC = () => {
  const params = useParams();
  const id = Number(params.id);
  const material = getMaterialById(id);

  if (!material) {
    return (
      <div className="materials-container">
        <div className="materials-wrapper">
          <div className="materials-header">
            <h1 className="materials-title">Material no encontrado</h1>
            <p className="materials-subtitle">El material solicitado no existe.</p>
            <Link to="/materiales" className="btn-small primary inline-flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" /> Volver a Materiales
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Funcionalidad de generación / reproducción de audio eliminada
  // Estado de disponibilidad ya no es necesario con la extracción directa
  // vistaActual: 'pdf' | 'video' | 'podcast'
  const [viewMode, setViewMode] = useState<'pdf' | 'video' | 'podcast'>('pdf');

  // Efectos de voz / timers removidos

  // Asegurar URLs robustas frente a acentos y espacios (si ya vienen encoded evitamos doble codificación)
  const pdfUrl = material.pdf ? (/[%]/.test(material.pdf) ? material.pdf : encodeURI(material.pdf)) : undefined;
  const rawVideo = material.video;
  const videoUrl = rawVideo ? (/[%]/.test(rawVideo) ? rawVideo : encodeURI(rawVideo)) : undefined;
  const rawPodcast = (material as any).podcast as string | undefined;
  const podcastUrl = rawPodcast ? (/[%]/.test(rawPodcast) ? rawPodcast : encodeURI(rawPodcast)) : undefined;
  const isMp4 = !!videoUrl && /\.mp4($|\?)/i.test(videoUrl);
  const isPodcastMp4 = !!podcastUrl && /\.mp4($|\?)/i.test(podcastUrl);

  // Cargar y extraer texto del PDF cuando se selecciona "pdf"
  // Lógica de extracción movida a PdfHtmlViewer

  return (
    <div className="materials-container">
      <div className="materials-wrapper">
        <div className="materials-header">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="materials-title">{material.title}</h1>
            </div>
            {/* Botón volver más pequeño y fijo en la esquina superior derecha */}
            <Link to="/materiales" className="btn-small primary volver-btn inline-flex items-center gap-1">
              <ArrowLeft className="w-4 h-4" />
              Volver
            </Link>
          </div>
        </div>

        <div className="expanded-material">
          <div className="expanded-content">
            <div className="expanded-body">

              <div className="material-actions" style={{ gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap', display:'flex', justifyContent:'center', width:'100%' }}>
                {/* Controles de audio eliminados */}
                {/* Toggle PDF / Video siempre visible (si hay video). Uno activo (azul), otro inactivo (gris). */}
                <div style={{ display:'flex', gap:'.5rem', flexWrap:'wrap', justifyContent:'center' }}>
                  <button
                    type="button"
                    onClick={() => setViewMode('pdf')}
                    className={`btn-expanded ${viewMode === 'pdf' ? 'primary' : 'secondary'}`}
                    aria-pressed={viewMode === 'pdf'}
                  >Ver PDF</button>
                  {material.video && (
                    <button
                      type="button"
                      onClick={() => setViewMode('video')}
                      className={`btn-expanded ${viewMode === 'video' ? 'primary' : 'secondary'}`}
                      aria-pressed={viewMode === 'video'}
                    >Ver video</button>
                  )}
                  {podcastUrl && (
                    <button
                      type="button"
                      onClick={() => setViewMode('podcast')}
                      className={`btn-expanded ${viewMode === 'podcast' ? 'primary' : 'secondary'}`}
                      aria-pressed={viewMode === 'podcast'}
                    ><Headphones className="w-4 h-4" style={{marginRight:4}} /> Escuchar Podcast</button>
                  )}
                  {pdfUrl && (
                    <a href={pdfUrl} download className="btn-expanded secondary" style={{ whiteSpace:'nowrap' }}>
                      <FileDown className="w-4 h-4" /> Descargar PDF
                    </a>
                  )}
                </div>
              </div>
              {viewMode === 'video' ? (
                videoUrl ? (
                  <div style={{ marginTop: '1rem', borderRadius: 8, overflow: 'hidden', background: '#000' }}>
                    {isMp4 ? (
                      <video
                        src={videoUrl}
                        style={{ width: '100%', maxHeight: 560, display: 'block', background: '#000' }}
                        controls
                        controlsList="nodownload"
                      >
                        Tu navegador no soporta la reproducción de video.
                      </video>
                    ) : (
                      <iframe
                        src={videoUrl}
                        title={material.title}
                        style={{ width: '100%', height: '520px', border: 'none', display: 'block' }}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                      />
                    )}
                  </div>
                ) : (
                  <div className="expanded-body" style={{ padding: '1rem' }}>
                    <p style={{ color: '#64748b', margin: 0 }}>Este material no tiene video asociado.</p>
                  </div>
                )
              ) : viewMode === 'podcast' ? (
                podcastUrl ? (
                  <div style={{ marginTop: '1rem', borderRadius: 8, overflow: 'hidden', background: '#0f172a', padding:'1rem' }}>
                    {isPodcastMp4 ? (
                      <audio
                        src={podcastUrl}
                        style={{ width: '100%' }}
                        controls
                      >Tu navegador no soporta audio HTML5.</audio>
                    ) : (
                      <p style={{ color:'#64748b', margin:0 }}>Formato de podcast no reconocido.</p>
                    )}
                  </div>
                ) : (
                  <div className="expanded-body" style={{ padding: '1rem' }}>
                    <p style={{ color: '#64748b', margin: 0 }}>Este material no tiene podcast.</p>
                  </div>
                )
              ) : (
                <>
                  {pdfUrl ? (
                    <PdfHtmlViewer pdfUrl={pdfUrl} />
                  ) : (
                    <div style={{ padding: '1rem', color: '#64748b' }}>No hay PDF disponible para este material.</div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaterialDetail;

// formatTime eliminado junto con controles de audio
