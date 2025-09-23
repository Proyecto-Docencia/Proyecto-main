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

  // Asegurar URLs robustas frente a acentos y espacios
  const pdfUrl = material.pdf ? encodeURI(material.pdf) : undefined;

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
                {pdfUrl && (
                  <>
                    <a href={pdfUrl} className="btn-expanded secondary" target="_blank" rel="noopener noreferrer">
                      Abrir PDF en pestaña nueva
                    </a>
                    <a href={pdfUrl} download className="btn-expanded secondary">
                      <FileDown className="w-4 h-4" /> Descargar PDF
                    </a>
                  </>
                )}
              </div>

              {pdfUrl ? (
                <div className="pdf-viewer">
                  <embed src={`${pdfUrl}#toolbar=1&navpanes=0`} type="application/pdf" className="pdf-iframe" />
                </div>
              ) : (
                <div className="expanded-body">
                  <p>No hay PDF disponible para este material.</p>
                </div>
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
