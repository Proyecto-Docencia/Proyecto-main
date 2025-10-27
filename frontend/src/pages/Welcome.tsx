import React from 'react';
import '../css/Welcome.css';

const cards = [
  { title: 'Materiales', desc: 'Administra y revisa recursos PDF y contenido con soporte de audio y etiquetas.' },
  { title: 'Planificaciones', desc: 'Crea, edita y consulta tus planificaciones académicas en un solo lugar.' },
  { title: 'Asistente IA', desc: 'Accede a herramientas asistidas para apoyo pedagógico y generación de ideas.' },
  { title: 'Perfil', desc: 'Mantén actualizados tus datos institucionales y preferencias.' }
];

const Welcome: React.FC = () => {
  return (
    <div className="welcome-background-wrapper">
      <div className="welcome-page">
        <header className="welcome-header">
          <h1>Bienvenido al Portal Docente USS</h1>
          <p>
            Este espacio centraliza tus materiales, planificación académica, herramientas de apoyo con IA y gestión de perfil.
            Tras iniciar sesión, utiliza el menú lateral para acceder rápidamente a cada módulo.
          </p>
        </header>

        {/* Video de introducción */}
        <section className="welcome-video-section">
          <div className="welcome-video-container">
            <video 
              controls 
              className="welcome-video"
              poster="/docs/FondoPortalUSS.jpg"
            >
              <source src="/docs/Videos/video-inicio-(Creatividad-Cap1).mp4" type="video/mp4" />
              <track kind="captions" label="Español" />
              Tu navegador no soporta la reproducción de video.
            </video>
          </div>
        </section>

        <section className="welcome-cards">
          {cards.map(card => (
            <div key={card.title} className="welcome-card">
              <h3>{card.title}</h3>
              <p>{card.desc}</p>
            </div>
          ))}
        </section>

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
