import React, { useEffect, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getMaterialById } from '../data/materials';
import '../css/Materials.css';
import { FileDown, Volume2, ArrowLeft, Pause, Play, Square } from 'lucide-react';
import { prepareSpeechFromPdf, SpeechController } from '../utils/pdfAudio';

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

  const controllerRef = useRef<SpeechController | null>(null);
  const [state, setState] = useState<'idle' | 'loading' | 'playing' | 'paused'>('idle');
  const [pos, setPos] = useState(0); // seconds
  const [total, setTotal] = useState(0); // seconds
  const [rate, setRate] = useState(1);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [voice, setVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [pdfAvailable, setPdfAvailable] = useState<boolean | null>(null);
  const [showVideo, setShowVideo] = useState(false);

  useEffect(() => {
    const id = setInterval(() => {
      const c = controllerRef.current;
      if (!c) return;
      const s = c.getState();
      setPos(s.currentTime);
      setTotal(s.totalTime);
      if (s.state === 'ended') setState('idle');
    }, 250);
    return () => clearInterval(id);
  }, []);

  // Cargar voces del sistema
  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    const loadVoices = () => {
      const v = window.speechSynthesis.getVoices();
      setVoices(v);
      // Elegir una voz española si existe
      const es = v.find((vv) => /es[-_]/i.test(vv.lang));
      setVoice(es || v[0] || null);
    };
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
    return () => {
      window.speechSynthesis.onvoiceschanged = null as any;
    };
  }, []);

  const handleGenerateAudio = async () => {
    if (!pdfUrl) return;
    try {
      if (!controllerRef.current) {
        setState('loading');
        controllerRef.current = await prepareSpeechFromPdf(pdfUrl, {
          lang: 'es-ES',
          rate,
          pitch: 1,
          wpm: 170,
          voice: voice || undefined,
        });
      }
      // Si teníamos una posición previa (por ejemplo al cambiar voz), intenta reanudar desde ahí
      const startAt = pos > 0 ? pos : undefined;
      controllerRef.current.play(startAt);
      setState('playing');
    } catch (e) {
      console.error(e);
      setState('idle');
      alert('No se pudo generar el audio del PDF.');
    }
  };

  const handlePause = () => {
    controllerRef.current?.pause();
    setState('paused');
  };

  const handleResume = () => {
    controllerRef.current?.resume();
    setState('playing');
  };

  const handleStop = () => {
    controllerRef.current?.stop();
    setState('idle');
    setPos(0);
  };

  const onSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const seconds = Number(e.target.value);
    setPos(seconds);
    controllerRef.current?.seekToSeconds(seconds);
  };

  // Asegurar URLs robustas frente a acentos y espacios (si ya vienen encoded evitamos doble codificación)
  const pdfUrl = material.pdf ? (/[%]/.test(material.pdf) ? material.pdf : encodeURI(material.pdf)) : undefined;
  const rawVideo = material.video;
  const videoUrl = rawVideo ? (/[%]/.test(rawVideo) ? rawVideo : encodeURI(rawVideo)) : undefined;
  const isMp4 = !!videoUrl && /\.mp4($|\?)/i.test(videoUrl);

  // Verificar disponibilidad real del PDF (HEAD) para evitar iframe vacío
  useEffect(() => {
    let aborted = false;
    (async () => {
      if (!pdfUrl) { setPdfAvailable(false); return; }
      try {
        const res = await fetch(pdfUrl, { method: 'HEAD' });
        if (!aborted) setPdfAvailable(res.ok && res.headers.get('content-type')?.includes('pdf') ? true : true); // si el servidor no da tipo igual intentamos
      } catch {
        if (!aborted) setPdfAvailable(false);
      }
    })();
    return () => { aborted = true; };
  }, [pdfUrl]);

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

              <div className="material-actions" style={{ gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                {/* Selectores de voz y velocidad */}
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <label style={{ fontSize: 12, color: '#64748b' }}>Voz:</label>
                  <select
                    value={voice?.name || ''}
                    onChange={async (e) => {
                      const v = voices.find((vv) => vv.name === e.target.value) || null;
                      setVoice(v);
                      // Si ya hay controlador, reiniciar con nueva voz manteniendo estado
                      if (controllerRef.current && pdfUrl) {
                        const wasPlaying = state === 'playing';
                        controllerRef.current.dispose();
                        controllerRef.current = null;
                        setPos(0);
                        if (wasPlaying) {
                          await handleGenerateAudio();
                        }
                      }
                    }}
                    className="btn-small"
                    style={{ minWidth: 180 }}
                  >
                    {voices.length === 0 && <option value="">(Cargando voces…)</option>}
                    {voices.map((v) => (
                      <option key={v.name} value={v.name}>
                        {v.name} ({v.lang})
                      </option>
                    ))}
                  </select>
                  <label style={{ fontSize: 12, color: '#64748b' }}>Velocidad:</label>
                  <select
                    value={rate}
                    onChange={async (e) => {
                      const r = Number(e.target.value);
                      setRate(r);
                      if (controllerRef.current && pdfUrl) {
                        const wasPlaying = state === 'playing';
                        controllerRef.current.dispose();
                        controllerRef.current = null;
                        setPos(0);
                        if (wasPlaying) {
                          await handleGenerateAudio();
                        }
                      }
                    }}
                    className="btn-small"
                    style={{ minWidth: 120 }}
                  >
                    {[0.8, 1, 1.2, 1.4].map((r) => (
                      <option key={r} value={r}>{r.toFixed(1)}x</option>
                    ))}
                  </select>
                </div>
                {state === 'idle' && (
                  <button onClick={handleGenerateAudio} disabled={!pdfUrl} className="btn-expanded primary">
                    <Volume2 className="w-4 h-4" /> Generar Audio del Texto
                  </button>
                )}
                {state === 'loading' && (
                  <button disabled className="btn-expanded secondary">Preparando audio…</button>
                )}
                {state === 'playing' && (
                  <>
                    <button onClick={handlePause} className="btn-small secondary inline-flex items-center gap-1">
                      <Pause className="w-4 h-4" /> Pausar
                    </button>
                    <button onClick={handleStop} className="btn-small secondary inline-flex items-center gap-1">
                      <Square className="w-4 h-4" /> Detener
                    </button>
                  </>
                )}
                {state === 'paused' && (
                  <>
                    <button onClick={handleResume} className="btn-small secondary inline-flex items-center gap-1">
                      <Play className="w-4 h-4" /> Reanudar
                    </button>
                    <button onClick={handleStop} className="btn-small secondary inline-flex items-center gap-1">
                      <Square className="w-4 h-4" /> Detener
                    </button>
                  </>
                )}
                {/* Slider de progreso/seek */}
                {(state === 'playing' || state === 'paused') && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', minWidth: '260px' }}>
                    <input
                      type="range"
                      min={0}
                      max={Math.max(1, Math.round(total))}
                      value={Math.round(pos)}
                      onChange={onSeek}
                      style={{ width: 200 }}
                    />
                    <span style={{ fontSize: 12, color: '#64748b' }}>
                      {formatTime(pos)} / {formatTime(total)}
                    </span>
                  </div>
                )}
                {/* Toggle PDF / Video siempre visible (si hay video). Uno activo (azul), otro inactivo (gris). */}
                <div style={{ display:'flex', gap:'.5rem' }}>
                  <button
                    type="button"
                    onClick={() => setShowVideo(false)}
                    className={`btn-expanded ${!showVideo ? 'primary' : 'secondary'}`}
                    aria-pressed={!showVideo}
                  >
                    Ver PDF
                  </button>
                  {material.video && (
                    <button
                      type="button"
                      onClick={() => setShowVideo(true)}
                      className={`btn-expanded ${showVideo ? 'primary' : 'secondary'}`}
                      aria-pressed={showVideo}
                    >
                      Ver video
                    </button>
                  )}
                  {/* Botón de descarga del PDF (sólo si existe url) */}
                  {pdfUrl && (
                    <a href={pdfUrl} download className="btn-expanded secondary" style={{ whiteSpace:'nowrap' }}>
                      <FileDown className="w-4 h-4" /> Descargar PDF
                    </a>
                  )}
                </div>
              </div>
              {showVideo ? (
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
              ) : (
                <>
                  {pdfUrl && pdfAvailable !== false && (
                    <div className="pdf-viewer">
                      <embed
                        src={`${pdfUrl}#toolbar=1&navpanes=0`}
                        type="application/pdf"
                        className="pdf-iframe"
                        onError={() => setPdfAvailable(false)}
                      />
                    </div>
                  )}
                  {(!pdfUrl || pdfAvailable === false) && (
                    <div className="expanded-body" style={{ padding: '1rem' }}>
                      <p style={{ color: '#64748b', margin: 0 }}>
                        {pdfUrl ? 'El PDF no pudo cargarse (posible nombre con acento o no encontrado).' : 'No hay PDF disponible para este material.'}
                      </p>
                    </div>
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

function formatTime(sec: number) {
  if (!isFinite(sec)) return '0:00';
  const s = Math.floor(sec % 60);
  const m = Math.floor(sec / 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}
