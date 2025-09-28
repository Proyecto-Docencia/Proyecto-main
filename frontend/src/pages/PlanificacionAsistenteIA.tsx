import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../css/Profile.css';
import { loadAssistedDraft, saveAssistedDraft } from '../utils/planningStorage';

// Página de asistencia IA para generar un borrador de planificación basado en capítulos
const PlanificacionAsistenteIA: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const email = user?.email || null;

  // Campos base que luego se mapearán a PlanificacionNueva
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [grade, setGrade] = useState('');
  const [objectives, setObjectives] = useState('');
  const [activities, setActivities] = useState('');
  const [resources, setResources] = useState('');
  const [evaluation, setEvaluation] = useState('');
  const [chapterFocus, setChapterFocus] = useState('Capítulo 1');
  const [loadingSuggestion, setLoadingSuggestion] = useState(false);
  const [suggestion, setSuggestion] = useState('Selecciona un capítulo y presiona "Generar sugerencia".');
  // Chat estilo Chatbot
  interface MiniMsg { id: string; type: 'user' | 'ai'; message: string; time: string; }
  const [chatInput, setChatInput] = useState('');
  const [status, setStatus] = useState<'online' | 'thinking'>('online');
  const [chatMessages, setChatMessages] = useState<MiniMsg[]>([{
    id: crypto.randomUUID(),
    type: 'ai',
    message: 'Hola, soy el asistente. Pide ajustes o más detalle sobre objetivos, actividades o evaluación.',
    time: new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})
  }]);
  const chatEndRef = useRef<HTMLDivElement | null>(null);
  useEffect(()=>{ chatEndRef.current?.scrollIntoView({behavior:'smooth'}); }, [chatMessages.length]);

  // Cargar borrador previo si existe
  useEffect(() => {
    const prev = loadAssistedDraft(email);
    if (prev) {
      setTitle(prev.title);
      setSubject(prev.subject);
      setGrade(prev.grade);
      setObjectives(prev.objectives);
      setActivities(prev.activities);
      setResources(prev.resources);
      setEvaluation(prev.evaluation);
    }
  }, [email]);

  const generateSuggestion = async () => {
    setLoadingSuggestion(true);
    // Simulación de IA: variar texto según capítulo
    await new Promise(r => setTimeout(r, 900));
    const base = chapterFocus.toLowerCase();
    const sug = `Sugerencia IA para ${chapterFocus}:\n` +
      `Objetivos: Enfatizar competencias clave del ${base}, promover pensamiento crítico y participación activa.\n` +
      `Actividades: 1) Activación de saberes previos con preguntas generadas por IA. 2) Trabajo colaborativo guiado. 3) Reflexión final asistida por IA.\n` +
      `Recursos: Extractos del ${chapterFocus}, pizarra digital, herramienta IA generativa.\n` +
      `Evaluación: Lista de cotejo + retroalimentación formativa automatizada.`;
    setSuggestion(sug);
    // Podríamos pre-rellenar ciertos campos si están vacíos
    if (!objectives) setObjectives('Desarrollar competencias vinculadas a ' + chapterFocus + '.');
    if (!activities) setActivities('Inicio: dinámica breve.\nDesarrollo: trabajo guiado por IA.\nCierre: reflexión y metacognición.');
    if (!resources) setResources('Texto del capítulo, herramienta IA, proyector.');
    if (!evaluation) setEvaluation('Rúbrica analítica + retroalimentación IA.');
    setLoadingSuggestion(false);
  };

  const handleGeneratePlanning = () => {
    saveAssistedDraft(email, {
      title: title || `Plan basado en ${chapterFocus}`,
      subject,
      grade,
      objectives,
      activities,
      resources,
      evaluation,
    });
    navigate('/planificacion/nueva');
  };

  const sendChat = async (e: React.FormEvent) => {
    e.preventDefault();
    const prompt = chatInput.trim();
    if (!prompt || status==='thinking') return;
    const userMsg: MiniMsg = { id: crypto.randomUUID(), type:'user', message: prompt, time: new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}) };
    setChatMessages(m => [...m, userMsg]);
    setChatInput('');
    setStatus('thinking');
    await new Promise(r => setTimeout(r, 850));
    let reply = '';
    if (/objetiv/i.test(prompt)) reply = 'Añade un objetivo que destaque pensamiento crítico y colaboración mediada por IA.';
    else if (/activ/i.test(prompt)) reply = 'Estructura actividades: 1) activación, 2) exploración guiada con IA, 3) metacognición.';
    else if (/evalu/i.test(prompt)) reply = 'Incorpora rúbrica con criterios: participación, calidad del producto y reflexión individual.';
    else if (/recurso/i.test(prompt)) reply = 'Considera recursos: extractos capítulo, herramienta IA, rúbrica compartida, foro asíncrono.';
    else reply = 'Puedo sugerir mejoras en objetivos, actividades, evaluación o recursos. Pregunta algo específico.';
    const aiMsg: MiniMsg = { id: crypto.randomUUID(), type:'ai', message: reply, time: new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}) };
    setChatMessages(m => [...m, aiMsg]);
    setStatus('online');
  };

  return (
    <div className="profile-container">
      <div className="profile-wrapper">
        <div className="profile-header" style={{alignItems:'center'}}>
          <div className="profile-header-main">
            <div className="profile-avatar"><span>AI</span></div>
            <div className="profile-header-info">
              <h1 className="profile-name">Planificación con Asistente IA</h1>
              <p className="profile-role">Genera un borrador a partir de los capítulos y ajusta con sugerencias IA</p>
            </div>
          </div>
          <button className="profile-edit-btn" onClick={handleGeneratePlanning}>Generar planificación</button>
        </div>

        <div className="profile-content-grid">
          <section className="profile-section">
            <div className="profile-section-header">
              <h2 className="profile-section-title">Configuración base</h2>
              <div style={{display:'flex', gap:'8px'}}>
                <select className="profile-input" value={chapterFocus} onChange={e => setChapterFocus(e.target.value)} style={{maxWidth:220}}>
                  <option>Capítulo 1</option>
                  <option>Capítulo 2</option>
                  <option>Capítulo 3</option>
                  <option>Capítulo 4</option>
                  <option>Capítulo 5</option>
                  <option>Capítulo 6</option>
                </select>
                <button className="profile-edit-btn" disabled={loadingSuggestion} onClick={generateSuggestion}>
                  {loadingSuggestion ? 'Generando...' : 'Generar sugerencia'}
                </button>
              </div>
            </div>
            <div className="profile-fields">
              <div className="profile-field">
                <label className="profile-label">Título</label>
                <input className="profile-input" value={title} onChange={e=>setTitle(e.target.value)} placeholder="Plan de sesión..." />
              </div>
              <div className="profile-field-row">
                <div className="profile-field-half profile-field">
                  <label className="profile-label">Asignatura</label>
                  <input className="profile-input" value={subject} onChange={e=>setSubject(e.target.value)} placeholder="Matemática" />
                </div>
                <div className="profile-field-half profile-field">
                  <label className="profile-label">Nivel/Curso</label>
                  <input className="profile-input" value={grade} onChange={e=>setGrade(e.target.value)} placeholder="3° Medio" />
                </div>
              </div>
              <div className="profile-field">
                <label className="profile-label">Objetivos</label>
                <textarea className="profile-input" rows={3} value={objectives} onChange={e=>setObjectives(e.target.value)} />
              </div>
              <div className="profile-field">
                <label className="profile-label">Actividades</label>
                <textarea className="profile-input" rows={4} value={activities} onChange={e=>setActivities(e.target.value)} />
              </div>
              <div className="profile-field-row">
                <div className="profile-field-half profile-field">
                  <label className="profile-label">Recursos</label>
                  <textarea className="profile-input" rows={3} value={resources} onChange={e=>setResources(e.target.value)} />
                </div>
                <div className="profile-field-half profile-field">
                  <label className="profile-label">Evaluación</label>
                  <textarea className="profile-input" rows={3} value={evaluation} onChange={e=>setEvaluation(e.target.value)} />
                </div>
              </div>
            </div>
          </section>

          <section className="profile-section">
            <div className="profile-section-header">
              <h2 className="profile-section-title">Sugerencias IA</h2>
            </div>
            <div className="profile-fields">
              <div className="profile-value" style={{display:'block', whiteSpace:'pre-wrap', minHeight:160}}>
                {suggestion}
              </div>
              <p style={{fontSize:12, color:'#64748b', margin:0}}>Estas sugerencias son simuladas localmente (no se está llamando a un backend de IA real).</p>
              <div className="profile-field" style={{marginTop:'16px'}}>
                <label className="profile-label">Chat con el asistente</label>
                <div style={{
                  border:'1px solid #e2e8f0',
                  borderRadius:12,
                  background:'#f8fafc',
                  display:'flex',
                  flexDirection:'column',
                  height:280
                }}>
                  <div style={{flex:1, overflowY:'auto', padding:'12px', display:'flex', flexDirection:'column', gap:'12px', background:'#f1f5f9'}}>
                    {chatMessages.map(m => (
                      <div key={m.id} style={{display:'flex', justifyContent: m.type==='user'?'flex-end':'flex-start'}}>
                        <div style={{
                          maxWidth:'78%',
                          background: m.type==='user' ? '#2563eb' : '#ffffff',
                          color: m.type==='user' ? '#fff' : '#1e293b',
                          padding:'10px 14px',
                          borderRadius: m.type==='user' ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
                          fontSize:14,
                          lineHeight:1.5,
                          position:'relative',
                          boxShadow: m.type==='user' ? '0 2px 4px rgba(37,99,235,0.35)' : '0 1px 3px rgba(0,0,0,0.08)',
                          border: m.type==='user' ? 'none' : '1px solid #e2e8f0'
                        }}>
                          <div style={{whiteSpace:'pre-wrap'}}>{m.message}</div>
                          <div style={{fontSize:10, marginTop:4, textAlign:'right', opacity:.7}}>{m.time}</div>
                        </div>
                      </div>
                    ))}
                    <div ref={chatEndRef} />
                  </div>
                  <form onSubmit={sendChat} style={{display:'flex', gap:'8px', padding:'10px', borderTop:'1px solid #e2e8f0', background:'#fff'}}>
                    <input
                      className="profile-input"
                      style={{flex:1, background:'#fff'}}
                      placeholder={status==='thinking' ? 'La IA está pensando...' : 'Pregunta o solicita un ajuste...'}
                      value={chatInput}
                      onChange={e=>setChatInput(e.target.value)}
                      disabled={status==='thinking'}
                    />
                    <button
                      type="submit"
                      className="profile-edit-btn"
                      disabled={status==='thinking' || !chatInput.trim()}
                      style={{
                        background: 'linear-gradient(135deg,#2563eb,#4f46e5)',
                        color:'#fff',
                        border:'none'
                      }}
                    >
                      {status==='thinking' ? '...' : 'Enviar'}
                    </button>
                  </form>
                </div>
                <p style={{fontSize:11, color:'#64748b', marginTop:6}}>El chat es una simulación local.</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PlanificacionAsistenteIA;