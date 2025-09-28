import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpen, 
  Brain,
  FileText,
  Presentation,
  GraduationCap,
  ChevronRight,
  Volume2,
  FileDown,
  ChevronLeft
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import '../css/Materials.css';
import { materials } from '../data/materials';

const Materials: React.FC = () => {
  const { user } = useAuth();
  
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{role: 'user'|'ai', text: string}>>([
    { role: 'ai', text: 'Bienvenido al asistente IA de USS. ¿En qué puedo ayudarte con los materiales educativos?' }
  ]);
  // Se eliminó el panel expandible; ahora la vista detallada es una página independiente
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  // Los materiales ahora se importan desde src/data/materials.ts para mantener una única fuente de verdad

  // Navegación de detalle ahora se realiza en la misma pestaña mediante <Link>

  // La generación de audio ahora se ofrece en la vista de detalle

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || chatLoading) return;

    const userMessage = chatInput;
    setChatInput('');
    setChatLoading(true);

    // Agregar mensaje del usuario
    setChatMessages(prev => [...prev, { role: 'user', text: userMessage }]);

    try {
      // Simular respuesta de IA
      await new Promise(resolve => setTimeout(resolve, 900));
      
      const aiResponse = `He recibido tu consulta sobre "${userMessage}". Como asistente educativo de USS, puedo ayudarte con información sobre materiales, metodologías de enseñanza y recursos académicos. ¿Hay algo específico sobre los materiales que te interese explorar?`;
      
      setChatMessages(prev => [...prev, { role: 'ai', text: aiResponse }]);
    } catch (error) {
      setChatMessages(prev => [...prev, { 
        role: 'ai', 
        text: 'Disculpa, hubo un error al procesar tu consulta. Por favor intenta nuevamente.' 
      }]);
    } finally {
      setChatLoading(false);
    }
  };

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages]);

  return (
    <div style={{
      position: 'relative',
      minHeight: 'calc(100vh - 80px)'
    }}>
      {/* Fondo institucional */}
      <div style={{
        position: 'absolute',
        inset: 0,
        /* Primer intento en /docs, fallback raíz */
        background: "url('/docs/FondoPortalUSS.jpg'), url('/FondoPortalUSS.jpg')",
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
        zIndex: 0,
        opacity: 1
      }} />
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'rgba(255,255,255,0.25)',
        backdropFilter: 'blur(0.5px)',
        zIndex: 1
      }} />
    <div className="materials-container" style={{ position:'relative', zIndex:2 }}>
      <div className="materials-wrapper">
        {/* Header USS con información del usuario */}
        <div className="materials-header">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="materials-title">
                <GraduationCap className="inline-block w-8 h-8 mr-2 text-blue-600" />
                Material Didáctico USS
              </h1>
              <p className="materials-subtitle">
                {user ? `Bienvenido/a, ${user.name}` : 'Recursos educativos generados con IA'} - Centro de Innovación Educativa
              </p>
            </div>
          </div>
        </div>

        {/* Grid de materiales */}
        <div className="materials-grid">
          {materials.map((material, index) => (
            <div key={material.id} className="material-card animate-fade-in-up" 
                 style={{ animationDelay: `${index * 0.1}s` }}>
              <div className="material-thumbnail">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
                  {material.type === 'CAPÍTULO' ? (
                    <BookOpen className="w-8 h-8 text-blue-600" />
                  ) : material.type === 'SIMULADOR' ? (
                    <Brain className="w-8 h-8 text-blue-600" />
                  ) : material.type === 'MULTIMEDIA' ? (
                    <Presentation className="w-8 h-8 text-blue-600" />
                  ) : material.type === 'EJERCICIOS' ? (
                    <FileText className="w-8 h-8 text-blue-600" />
                  ) : (
                    <GraduationCap className="w-8 h-8 text-blue-600" />
                  )}
                </div>
                {/* Se removió la insignia IA para una UI más limpia según solicitud */}
              </div>
              
              <div className="material-content">
                {/* Título limpio sin badges adicionales */}
                <h3 className="material-title">{material.title}</h3>
                <p className="material-description">{material.description}</p>
                
                <div className="material-actions">
                  {/* Iconos no clickeables para mostrar disponibilidad */}
                  <div className="material-icons" aria-label="Disponibilidad de recursos">
                    {/* Audio: placeholder siempre visible por ahora */}
                    <div className="icon-indicator audio" aria-hidden="true">
                      <Volume2 className="w-3 h-3" />
                      Audio
                    </div>
                    {/* PDF: solo mostrar si hay PDF disponible */}
                    {material.pdf && (
                      <div className="icon-indicator document">
                        <FileDown className="w-3 h-3" />
                        PDF
                      </div>
                    )}
                    {/* Video: mostrar si hay video */}
                    {material.video && (
                      <div className="icon-indicator video">
                        {/* Reutilizamos Presentation como símbolo de video/multimedia */}
                        <Presentation className="w-3 h-3" />
                        Video
                      </div>
                    )}
                  </div>
                  
                  {/* Botón funcional de detalles */}
                  <Link 
                    to={`/material/${material.id}`}
                    className="btn-small primary inline-flex items-center gap-1"
                  >
                    <ChevronRight className="w-3 h-3" />
                    Detalles
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
        
  {/* La vista detallada se navega en la misma pestaña (/material/:id) */}
      </div>

      {/* Toggle lateral estilo flecha */}
      <button
        className={`chat-slide-toggle ${chatOpen ? 'open' : ''}`}
        onClick={() => setChatOpen(o => !o)}
        aria-label={chatOpen ? 'Ocultar asistencia IA' : 'Mostrar asistencia IA'}
      >
        {chatOpen ? <ChevronRight className="w-8 h-8" /> : <ChevronLeft className="w-8 h-8" />}
      </button>

      <div className={`chat-side-wrapper ${chatOpen ? 'visible' : ''}`} aria-hidden={!chatOpen}>
        <div className="chat-side-inner">
          <div className="chat-side-header">
            <div className="chat-side-title">
              <span className="chat-side-badge">AI</span>
              <h3>Asistencia IA USS</h3>
            </div>
          </div>
          <div className="chat-side-messages" role="log">
            {chatMessages.map((m, i) => (
              <div key={i} className={`cs-msg ${m.role}`}> 
                <div className="cs-bubble">{m.text}</div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>
          <form onSubmit={sendMessage} className="chat-side-input-row">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Escribe tu consulta..."
              className="chat-side-input"
              disabled={chatLoading}
            />
            <button
              type="submit"
              disabled={chatLoading || !chatInput.trim()}
              className="chat-side-send"
            >
              {chatLoading ? '...' : 'Enviar'}
            </button>
          </form>
        </div>
      </div>
    </div>
    </div>
  );
};

export default Materials;