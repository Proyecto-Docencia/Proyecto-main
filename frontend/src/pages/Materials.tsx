import React, { useState, useEffect } from 'react';
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
  ChevronLeft,
  LucideProps,
  PenLine,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import MarkdownMessage from '../components/MarkdownMessage';
import '../css/Materials.css';
import { materials } from '../data/materials';
import { useChat } from '../hooks/useChat';

// Estilos en línea extraídos para mayor legibilidad
const backgroundOverlayStyle: React.CSSProperties = {
  position: 'absolute',
  inset: 0,
  background: "url('/docs/FondoPortalUSS.jpg'), url('/FondoPortalUSS.jpg')",
  backgroundPosition: 'center',
  backgroundSize: 'cover',
  backgroundRepeat: 'no-repeat',
  backgroundAttachment: 'fixed',
  zIndex: 0,
  opacity: 1,
};

const blurOverlayStyle: React.CSSProperties = {
  position: 'absolute',
  inset: 0,
  background: 'rgba(255,255,255,0.25)',
  backdropFilter: 'blur(0.5px)',
  zIndex: 1,
};

const Materials: React.FC = () => {
  const { user } = useAuth();

  const [chatOpen, setChatOpen] = useState(false);
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
      text: 'Bienvenido al asistente IA de USS. ¿En qué puedo ayudarte con los materiales educativos?',
    },
  ]);

  // Mantiene la variable CSS --chat-side-width sincronizada con el ancho del chat
  useEffect(() => {
    const setChatWidthVar = () => {
      const el = document.querySelector('.chat-side-wrapper');
      if (el) {
        document.documentElement.style.setProperty('--chat-side-width', `${el.clientWidth}px`);
      }
    };
    setChatWidthVar();
    window.addEventListener('resize', setChatWidthVar);
    return () => window.removeEventListener('resize', setChatWidthVar);
  }, [chatOpen]);

  const renderMaterialIcon = (type: string): React.ReactElement<LucideProps> => {
    const commonProps = { className: 'w-8 h-8 text-blue-600' };
    switch (type) {
      case 'CAPÍTULO':
        return <BookOpen {...commonProps} />;
      case 'SIMULADOR':
        return <Brain {...commonProps} />;
      case 'MULTIMEDIA':
        return <Presentation {...commonProps} />;
      case 'EJERCICIOS':
        return <FileText {...commonProps} />;
      default:
        return <GraduationCap {...commonProps} />;
    }
  };

  return (
    <div
      className={chatOpen ? 'with-chat-open' : ''}
      style={{
        position: 'relative',
        minHeight: 'calc(100vh - 80px)',
      }}
    >
      {/* Fondo institucional y superposición de desenfoque */}
      <div style={backgroundOverlayStyle} />
      <div style={blurOverlayStyle} />

      <div className="materials-container" style={{ position: 'relative', zIndex: 2 }}>
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
            {materials.map((material) => (
              <div
                key={material.id}
                className="material-card animate-fade-in-up"
              >
                <div className="material-thumbnail">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
                    {renderMaterialIcon(material.type)}
                  </div>
                </div>

                <div className="material-content">
                  <h3 className="material-title">{material.title}</h3>
                  <p className="material-description">{material.description}</p>

                  <div className="material-actions">
                    <div className="material-icons" aria-label="Disponibilidad de recursos">
                      <div className="icon-indicator audio" aria-hidden="true">
                        <Volume2 className="w-3 h-3" />
                        Audio
                      </div>
                      {material.pdf && (
                        <div className="icon-indicator document">
                          <FileDown className="w-3 h-3" />
                          PDF
                        </div>
                      )}
                      {material.video && (
                        <div className="icon-indicator video">
                          <Presentation className="w-3 h-3" />
                          Video
                        </div>
                      )}
                      <Link 
                        to="/planificacion/asistente-ia"
                        className="icon-indicator planificacion"
                      >
                        <PenLine className="w-3 h-3" />
                        Planificación
                      </Link>
                    </div>

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
        </div>

        {/* Toggle lateral para abrir/cerrar el chat */}
        <button
          className={`chat-slide-toggle ${chatOpen ? 'open' : ''}`}
          onClick={() => setChatOpen((o) => !o)}
          aria-label={chatOpen ? 'Ocultar asistencia IA' : 'Mostrar asistencia IA'}
        >
          {chatOpen ? <ChevronRight className="w-8 h-8" /> : <ChevronLeft className="w-8 h-8" />}
        </button>

        {/* Panel lateral del Chat */}
        <div className={`chat-side-wrapper ${chatOpen ? 'open' : ''}`}>
          <div className="chat-side-inner">
            <div className="chat-side-header">
              <div className="chat-side-title">
                <div className="chat-side-badge">AI</div>
                <h3>Asistente IA</h3>
              </div>
            </div>
            <div className="chat-side-messages">
              {chatMessages.map((msg, index) => (
                <div
                  key={`chat-msg-${msg.role}-${index}`}
                  className={`cs-msg ${msg.role}`}
                >
                  <div className="cs-bubble">
                    <MarkdownMessage content={msg.text} isUser={msg.role === 'user'} />
                  </div>
                </div>
              ))}
              {chatLoading && (
                <div className="cs-msg ai">
                  <div className="cs-bubble">
                    <div className="typing-indicator">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>
            <div className="chat-side-footer">
              <form onSubmit={sendMessage} className="chat-input-form">
                <input
                  type="text"
                  className="chat-input"
                  placeholder={chatLoading ? 'Pensando...' : 'Escribe tu pregunta...'}
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  disabled={chatLoading}
                />
                <button type="submit" className="chat-send-btn" disabled={chatLoading}>
                  <ChevronRight className="w-5 h-5" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Materials;