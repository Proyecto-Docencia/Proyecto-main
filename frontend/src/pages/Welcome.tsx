import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Calendar, MessageSquare, UserCircle } from 'lucide-react';
import '../css/Welcome.css';

const Welcome: React.FC = () => {
  const [expanded, setExpanded] = useState<number | null>(null);

  const details: Record<number, { title: string; content: string; icon: JSX.Element }> = {
    1: {
      title: 'Materiales',
      content:
        'Explora, organiza y revisa recursos por capítulo (PDF, audio y HTML). Filtra por etiquetas, escucha audios sincronizados y usa herramientas de transcripción y anotación para preparar tus clases.',
      icon: (
        <div className="expanded-icon" style={{ background: 'rgba(99,102,241,0.08)' }}>
          <BookOpen style={{ width: 22, height: 22, color: 'rgb(99 102 241)' }} />
        </div>
      ),
    },
    2: {
      title: 'Planificaciones',
      content:
        'Crea y reutiliza plantillas, programa actividades y registra evidencias. Controla versiones, comparte con colegas y exporta tus planificaciones para integrarlas en otros sistemas',
      icon: (
        <div className="expanded-icon" style={{ background: 'rgba(139,92,246,0.06)' }}>
          <Calendar style={{ width: 22, height: 22, color: 'rgb(139 92 246)' }} />
        </div>
      ),
    },
    3: {
      title: 'Asistente IA DANIA',
      content:
        'Con la ayuda de DANIA genera ideas, prompts y actividades listos para usar; pide reformulaciones o ejemplos y recibe sugerencias de evaluación y retroalimentación para mejorar tus actividades y rúbricas',
      icon: (
        <div className="expanded-icon" style={{ background: 'rgba(16,185,129,0.06)' }}>
          <MessageSquare style={{ width: 22, height: 22, color: 'rgb(16 185 129)' }} />
        </div>
      ),
    },
    4: {
      title: 'Perfil',
      content:
        'Actualiza tu información y preferencias: nombre, cargo, roles y idioma. Configura notificaciones y revisa permisos de acceso. Si conectas servicios (como correo institucional), sigue las instrucciones paso a paso para completar la integración.',
      icon: (
        <div className="expanded-icon" style={{ background: 'rgba(250,204,21,0.06)' }}>
          <UserCircle style={{ width: 22, height: 22, color: 'rgb(245 158 11)' }} />
        </div>
      ),
    },
  };

  return (
    <div className="welcome-background-wrapper">
      <div className="welcome-page">
        <header className="welcome-header">
          {/* Header placed inside a card to match other cards */}
          <div className="welcome-card" style={{ 
            padding: '22px', 
            position: 'relative'
          }}>
            <h1>Bienvenido al Portal Docente USS</h1>
            <p style={{ maxWidth: '70%' }}>
              Este espacio centraliza tus materiales, planificación académica, herramientas de apoyo con IA con nuestra IA llamada DANIA que será tu ayuante cuando lo necesites y además está la gestión
              de perfil. Tras iniciar sesión, utiliza el menú lateral para acceder rápidamente a cada módulo.
            </p>
            
            {/* Logo DANIA en la esquina superior derecha */}
            <div style={{ 
              position: 'absolute',
              top: '22px',
              right: '22px',
              width: '150px', 
              height: '150px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(139, 92, 246, 0.1))',
              borderRadius: '20px',
              padding: '12px',
              border: '3px solid rgba(99, 102, 241, 0.2)',
              boxShadow: '0 4px 12px rgba(99, 102, 241, 0.1)'
            }}>
              <img 
                src="/imagenes/Logo_con_nombre.png" 
                alt="DANIA - Asistente de Alfabetización Digital" 
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  objectFit: 'contain',
                  borderRadius: '12px'
                }}
              />
            </div>
          </div>
        </header>

        {/* If a card is expanded, show expanded panel + video side-by-side; otherwise show video then cards */}
        {expanded ? (
          <section className="welcome-expanded">
            <div className="expanded-panel">
              <button className="close-expanded" onClick={() => setExpanded(null)} aria-label="Cerrar">
                {/* Left arrow icon (inherits color via currentColor) */}
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                {details[expanded].icon}
                <h2>{details[expanded].title}</h2>
              </div>
              <p>{details[expanded].content}</p>
              {expanded !== 4 && (
                <p style={{ marginTop: 12 }}>
                  Puedes acceder a la sección correspondiente desde el menú o presionar el botón de abajo.
                </p>
              )}
              {/* CTA in expanded panel for quick navigation */}
              <div style={{ marginTop: 14 }}>
                {expanded === 1 && (
                  <Link to="/materiales" className="welcome-cta" aria-label="Ir a Materiales">Ir a Materiales</Link>
                )}
                {expanded === 2 && (
                  <Link to="/planificacion/mis-planificaciones" className="welcome-cta" aria-label="Ir a Planificaciones">Ir a Planificaciones</Link>
                )}
                {expanded === 3 && (
                  <Link to="/chatbot" className="welcome-cta" aria-label="Ir a Asistente IA">Ir al Asistente IA</Link>
                )}
              </div>
            </div>
            <div className="expanded-video">
              <div className="welcome-video-container">
                <div className="relative" style={{ position: 'relative' }}>
                  <div className="absolute" style={{ inset: 0, opacity: 0.08 }}>
                    <svg className="w-full h-full" viewBox="0 0 800 450" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="150" cy="100" r="80" fill="currentColor" className="text-purple-400" />
                      <circle cx="650" cy="350" r="100" fill="currentColor" className="text-blue-400" />
                    </svg>
                  </div>
                  <video
                    controls
                    controlsList="nodownload"
                    onContextMenu={(e) => e.preventDefault()}
                    className="welcome-video small"
                    poster="/docs/FondoPortalUSS.jpg"
                  >
                    <source src="/docs/Videos/Marco-educativo-resumen-de-la-web.mp4" type="video/mp4" />
                    Tu navegador no soporta la reproducción de video.
                  </video>
                </div>
              </div>
            </div>
          </section>
        ) : (
          <>
            {/* Video de introducción adaptada al estilo actual */}
            <section className="welcome-video-section">
              <div className="welcome-video-container">
                <div className="relative" style={{ position: 'relative' }}>
                  <div className="absolute" style={{ inset: 0, opacity: 0.08 }}>
                    {/* decorative svg background kept subtle */}
                    <svg className="w-full h-full" viewBox="0 0 800 450" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="150" cy="100" r="80" fill="currentColor" className="text-purple-400" />
                      <circle cx="650" cy="350" r="100" fill="currentColor" className="text-blue-400" />
                      <path d="M 100 300 Q 250 200 400 300 T 700 300" stroke="currentColor" strokeWidth="3" fill="none" className="text-blue-300" />
                    </svg>
                  </div>

                  <video
                    controls
                    controlsList="nodownload"
                    onContextMenu={(e) => e.preventDefault()}
                    className="welcome-video"
                    poster="/docs/FondoPortalUSS.jpg"
                  >
                    <source src="/docs/Videos/Marco-educativo-resumen-de-la-web.mp4" type="video/mp4" />
                    Tu navegador no soporta la reproducción de video.
                  </video>
                </div>
              </div>
            </section>

            {/* Feature Cards Grid - reuse welcome-card styles to keep consistent look */}
            <section className="welcome-cards">
              <div className="welcome-card" role="button" tabIndex={0} onClick={() => setExpanded(1)} onKeyDown={(e) => e.key === 'Enter' && setExpanded(1)}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <div style={{ width: 40, height: 40, borderRadius: 8, background: 'rgba(99,102,241,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <BookOpen style={{ width: 20, height: 20, color: 'rgb(99 102 241)' }} />
              </div>
              <div>
                <h3>Materiales</h3>
                <p className="text-sm">Accede y organiza recursos por capítulo (PDF, audio y contenido web). Reproduce audios, añade notas y filtra por etiquetas para encontrar actividades o lecturas. También puedes generar una transcripción o un resumen rápido para preparar tus clases.</p>
              </div>
            </div>
            
              </div>

              <div className="welcome-card" role="button" tabIndex={0} onClick={() => setExpanded(2)} onKeyDown={(e) => e.key === 'Enter' && setExpanded(2)}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <div style={{ width: 40, height: 40, borderRadius: 8, background: 'rgba(139,92,246,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Calendar style={{ width: 20, height: 20, color: 'rgb(139 92 246)' }} />
              </div>
              <div>
                <h3>Planificaciones</h3>
                <p className="text-sm">Crea y gestiona tus planificaciones: usa plantillas, añade sesiones y describe las actividades por clase. Registra evidencias y guarda versiones para recuperar cambios anteriores. Comparte con colegas y exporta cuando necesites usar la planificación en otro sistema.</p>
              </div>
            </div>
            
              </div>

              <div className="welcome-card" role="button" tabIndex={0} onClick={() => setExpanded(3)} onKeyDown={(e) => e.key === 'Enter' && setExpanded(3)}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <div style={{ width: 40, height: 40, borderRadius: 8, background: 'rgba(16,185,129,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <MessageSquare style={{ width: 20, height: 20, color: 'rgb(16 185 129)' }} />
              </div>
              <div>
                <h3>Asistente IA DANIA</h3>
                <p className="text-sm"> Con la ayuda de DANIA genera ideas y actividades listas para usar: pide una actividad por tema, duración o nivel y recibe pasos, materiales y criterios de evaluación. Puedes pedir adaptaciones (más fácil o más desafiante) y editar lo que el asistente sugiere.</p>
              </div>
            </div>
            
              </div>

              <div className="welcome-card" role="button" tabIndex={0} onClick={() => setExpanded(4)} onKeyDown={(e) => e.key === 'Enter' && setExpanded(4)}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <div style={{ width: 40, height: 40, borderRadius: 8, background: 'rgba(250,204,21,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <UserCircle style={{ width: 20, height: 20, color: 'rgb(245 158 11)' }} />
              </div>
              <div>
                <h3>Perfil</h3>
                <p className="text-sm">Actualiza tu información y preferencias: nombre, cargo, roles y idioma. Configura notificaciones y revisa permisos de acceso. Si conectas servicios (como correo institucional), sigue las instrucciones paso a paso para completar la integración.</p>
              </div>
            </div>
              </div>
            </section>
          </>
        )}

        {/* How to Start Section - reuse welcome-block styling */}
        <section className="welcome-block">
          <h2>Cómo empezar</h2>
          <ol>
            <li>Dirígete a Materiales para explorar o registrar nuevos recursos.</li>
            <li>Crea tu primera planificación desde el menú “Crear Planificación”.</li>
            <li>Prueba el Chat para recibir sugerencias asistidas.</li>
            <li>Completa o ajusta tus datos en la sección Perfil.</li>
          </ol>
          <p>Este portal se encuentra en evolución continua: nuevas funciones de análisis y apoyo docente se irán integrando.</p>
        </section>
      </div>
    </div>
  );
};

export default Welcome;
