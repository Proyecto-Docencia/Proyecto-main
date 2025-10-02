import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../css/Profile.css';
import { loadAssistedDraft, saveAssistedDraft } from '../utils/planningStorage';
import { useChat } from '../hooks/useChat';

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

  // Usar el hook de chat centralizado
  const {
    messages: chatMessages,
    input: chatInput,
    loading: chatLoading,
    setInput: setChatInput,
    sendMessage,
    chatEndRef,
  } = useChat([
    {
      role: 'ai',
      text: 'Hola, soy el asistente. Pide ajustes o más detalle sobre objetivos, actividades o evaluación para tu planificación.',
    },
  ]);

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

  const handleGeneratePlanning = () => {
    saveAssistedDraft(email, {
      title: title || `Planificación Asistida`,
      subject,
      grade,
      objectives,
      activities,
      resources,
      evaluation,
    });
    navigate('/planificacion/nueva');
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
              <h2 className="profile-section-title">Borrador de Planificación</h2>
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
              <h2 className="profile-section-title">Ajustes con IA</h2>
            </div>
            <div className="profile-fields">
                  <p style={{fontSize:12, color:'#64748b', margin:0}}>Interactúa con la IA para refinar los campos de tu planificación.</p>
                  <div className="profile-field" style={{marginTop:'16px'}}>
                    <label className="profile-label">Chat con el asistente</label>
                    <div style={{
                      border:'1px solid #e2e8f0',
                      borderRadius:12,
                      background:'#f8fafc',
                      display:'flex',
                      flexDirection:'column',
                      height:400
                    }}>
                      <div style={{flex:1, overflowY:'auto', padding:'12px', display:'flex', flexDirection:'column', gap:'12px', background:'#f1f5f9'}}>
                        {chatMessages.map((m, index) => (
                          <div key={index} style={{display:'flex', justifyContent: m.role ==='user'?'flex-end':'flex-start'}}>
                            <div style={{
                              maxWidth:'78%',
                              background: m.role ==='user' ? '#2563eb' : '#ffffff',
                              color: m.role ==='user' ? '#fff' : '#1e293b',
                              padding:'10px 14px',
                              borderRadius: m.role ==='user' ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
                              fontSize:14,
                              lineHeight:1.5,
                              position:'relative',
                              boxShadow: m.role ==='user' ? '0 2px 4px rgba(37,99,235,0.35)' : '0 1px 3px rgba(0,0,0,0.08)',
                              border: m.role ==='user' ? 'none' : '1px solid #e2e8f0'
                            }}>
                              <div style={{whiteSpace:'pre-wrap'}}>{m.text}</div>
                            </div>
                          </div>
                        ))}
                        <div ref={chatEndRef} />
                      </div>
                      <form onSubmit={sendMessage} style={{display:'flex', gap:'8px', padding:'10px', borderTop:'1px solid #e2e8f0', background:'#fff'}}>
                        <input
                          className="profile-input"
                          style={{flex:1, background:'#fff'}}
                          placeholder={chatLoading ? 'La IA está pensando...' : 'Pregunta o solicita un ajuste...'}
                          value={chatInput}
                          onChange={e=>setChatInput(e.target.value)}
                          disabled={chatLoading}
                        />
                        <button
                          type="submit"
                          className="profile-edit-btn"
                          disabled={chatLoading || !chatInput.trim()}
                          style={{
                            background: 'linear-gradient(135deg,#2563eb,#4f46e5)',
                            color:'#fff',
                            border:'none'
                          }}
                        >
                          {chatLoading ? '...' : 'Enviar'}
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      );
    };

export default PlanificacionAsistenteIA;