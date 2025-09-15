import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BookOpen, 
  Plus, 
  Search, 
  Filter,
  Download,
  Heart,
  Brain,
  Video,
  FileText,
  Presentation
} from 'lucide-react';

const Materials: React.FC = () => {
  const navigate = useNavigate();
  // Eliminados searchTerm y selectedType
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<Array<{role: 'user'|'ai', text: string}>>([
    { role: 'ai', text: 'Bienvenido al chat de OpenAI. ¿En qué puedo ayudarte hoy?' }
  ]);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (chatOpen && chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, chatOpen]);
  const [infoOpenId, setInfoOpenId] = useState<number | null>(null);
  const [showVideo, setShowVideo] = useState<{ open: boolean; materialId: number | null }>({ open: false, materialId: null });

  // Eliminado materialTypes

  // Simulación de enlaces de video y PDF por material (puedes completarlos según tus recursos)
  const videoLinks: Record<number, string> = {
    1: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    2: 'https://www.youtube.com/embed/9bZkp7q19f0',
    3: 'https://www.youtube.com/embed/3JZ_D3ELwOQ',
    4: 'https://www.youtube.com/embed/L_jWHffIx5E',
    5: 'https://www.youtube.com/embed/tVj0ZTS4WF4',
    6: 'https://www.youtube.com/embed/fJ9rUzIMcZQ',
  };
  const pdfLinks: Record<number, string> = {
    1: '/docs/Capítulo_TrabajoColaborativo_versión_1.pdf',
    2: '/docs/Capitulo2Ciclo_versión_1.pdf',
    3: '/docs/Capitulo3_Alfabetización_versión_1.pdf',
    4: '',
    5: '',
    6: '',
  };
  const materials = [
    {
      id: 1,
      title: "Capítulo 1 - Trabajo Colaborativo",
      description: "Guía para diseñar experiencias colaborativas en el aula integrando IA generativa como miembro activo del equipo.",
      type: "capitulo",
      subject: "Educación universitaria / Transversal",
      grade: "N/A",
      isAI: true,
      thumbnail: "🔢",
      createdAt: "Hace 3 días",
      keyConcepts: [
        "Roles colaborativos de la IA",
        "Ciclo de integración en el aula",
        "Evaluación del trabajo colaborativo",
        "Ejemplos por disciplina",
        "Competencias desarrolladas"
      ],
      recommendedUse: "Diseño de clases activas, proyectos grupales, formación docente en innovación educativa"
    },
    {
      id: 2,
      title: "Capítulo 2 - Ciclo de Experiencias de Aprendizaje con IAGen",
      description: "Modelo paso a paso para diseñar, ejecutar y evaluar experiencias de aprendizaje universitarias integrando IA generativa como mediador pedagógico para evaluar conocimientos previos en ciencias naturales con análisis automático.",
      type: "capitulo",
      subject: "Educación universitaria / Transversal",
      grade: "N/A",
      isAI: true,
      thumbnail: "🌱",
      createdAt: "Hace 1 semana",
      keyConcepts: [
        "Diagnóstico inicial de habilidades",
        "Planificación didáctica con IA",
        "Ejecución y monitoreo del aprendizaje",
        "Reflexión y asimilación de aprendizajes",
        "Evaluación del ciclo completo"
      ],
      recommendedUse: "Diseño de clases activas, formación docente, rediseño curricular con enfoque en competencias digitales"
    },
    {
      id: 3,
      title: "Capítulo 3 - Alfabetización Digital en IAGen",
      description: "Guía práctica para desarrollar competencias en el uso ético, crítico y efectivo de herramientas de IA generativa en la educación superior estructurada para proyectos de investigación histórica con rúbrica incluida.",
      type: "capitulo",
      subject: "Educación universitaria / Transversal",
      grade: "N/A",
      isAI: false,
      thumbnail: "📚",
      createdAt: "Hace 5 días",
      keyConcepts: [
        "Alfabetización digital en IAGen",
        "Uso ético y crítico de IA",
        "Diseño de prompts efectivos",
        "Evaluación de sesgos y limitaciones",
        "Ciclo de integración en el aula"
      ],
      recommendedUse: "Formación docente, introducción a IA en asignaturas, desarrollo de competencias digitales"
    },
    {
      id: 4,
      title: "Simulador de Reacciones Químicas",
      description: "Herramienta interactiva para experimentar con diferentes reacciones químicas.",
      type: "capitulo",
      subject: "Química",
      grade: "5° Secundaria",
      isAI: true,
      thumbnail: "⚗️",
      createdAt: "Hace 6 días",
      keyConcepts: ["Reacciones químicas", "Simulación interactiva"],
      recommendedUse: "Laboratorio virtual, prácticas de química"
    },
    {
      id: 5,
      title: "Historia de la Revolución Industrial",
      description: "Presentación multimedia con línea de tiempo y mapas interactivos.",
      type: "capitulo",
      subject: "Historia",
      grade: "3° Secundaria",
      isAI: true,
      thumbnail: "🏭",
      createdAt: "Hace 3 días",
      keyConcepts: ["Revolución Industrial", "Línea de tiempo", "Mapas interactivos"],
      recommendedUse: "Clases de historia, recursos multimedia"
    },
    {
      id: 6,
      title: "Ejercicios de Gramática Avanzada",
      description: "Conjunto de ejercicios progresivos para dominar la gramática española.",
      type: "capitulo",
      subject: "Lengua y Literatura",
      grade: "4° Secundaria",
      isAI: true,
      thumbnail: "✏️",
      createdAt: "Hace 1 semana",
      keyConcepts: ["Gramática avanzada", "Ejercicios interactivos"],
      recommendedUse: "Clases de lengua, práctica autónoma"
    }
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'presentations': return Presentation;
      case 'worksheets': return FileText;
      case 'videos': return Video;
      case 'interactive': return Brain;
      default: return BookOpen;
    }
  };

  // Eliminado filteredMaterials, se usará materials directamente

  return (
    <div className="space-y-8 relative">
      {/* Botón flotante para abrir/cerrar chat */}
      <button
        className={`fixed bottom-8 right-8 z-50 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg p-4 transition-all duration-200 flex items-center justify-center ${chatOpen ? 'rotate-90' : ''}`}
        style={{ boxShadow: '0 4px 16px rgba(30,64,175,0.15)' }}
        onClick={() => setChatOpen((open) => !open)}
        aria-label={chatOpen ? 'Cerrar chat' : 'Abrir chat'}
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
      </button>

      {/* Panel lateral de chat OpenAI */}
      {chatOpen && (
        <div
          className="fixed top-0 right-0 h-full bg-white border-l border-slate-200 shadow-2xl z-50 flex flex-col transition-all duration-300"
          style={{
            width: '100%',
            maxWidth: '420px',
            minWidth: '320px',
            boxShadow: '0 8px 32px rgba(30,64,175,0.18)',
            right: 0
          }}
        >
          <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-gradient-to-r from-blue-50 to-blue-100">
            <span className="font-bold text-lg text-blue-800">Chat OpenAI</span>
            <button onClick={() => setChatOpen(false)} className="text-slate-500 hover:text-slate-800 text-2xl" aria-label="Cerrar chat">&times;</button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 bg-slate-50" style={{fontFamily:'inherit', minHeight: 0}}>
            {chatMessages.map((msg, idx) => (
              <div key={idx} className={`mb-3 flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm shadow-sm ${msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-white border border-slate-200 text-slate-800'}`}>{msg.text}</div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>
          <form className="p-4 border-t border-slate-200 flex gap-2 bg-white" onSubmit={e => {
            e.preventDefault();
            if (!chatInput.trim()) return;
            setChatMessages(msgs => [...msgs, { role: 'user', text: chatInput }]);
            // Simulación de respuesta AI
            setTimeout(() => {
              setChatMessages(msgs => [...msgs, { role: 'ai', text: 'Esta es una respuesta simulada de OpenAI. (Aquí iría la respuesta real)' }]);
            }, 900);
            setChatInput('');
          }}>
            <input
              type="text"
              className="flex-1 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Escribe tu mensaje..."
              value={chatInput}
              onChange={e => setChatInput(e.target.value)}
              autoFocus
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium text-sm hover:bg-blue-700 transition-colors duration-200"
              disabled={!chatInput.trim()}
            >Enviar</button>
          </form>
        </div>
      )}
  {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Material Didáctico</h1>
          <p className="text-slate-600 mt-2">
            Recursos educativos generados con IA para potenciar tu enseñanza
          </p>
        </div>
        <button className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 font-medium flex items-center space-x-2 shadow-sm">
          <Plus className="w-5 h-5" />
          <span>Generar Material</span>
        </button>
      </div>

      {/* Search and Filters eliminados */}

      {/* Materials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {materials.map((material) => {
          const TypeIcon = getTypeIcon(material.type);
          return (
            <div key={material.id} className="bg-white rounded-xl shadow-sm border border-slate-200 hover:shadow-lg transition-all duration-300 overflow-hidden group relative">
              {/* Thumbnail */}
              <div className="h-48 bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center relative overflow-hidden">
                <div className="text-6xl opacity-50">
                  {material.thumbnail}
                </div>
                {material.isAI && (
                  <div className="absolute top-3 right-3">
                    <div className="px-2 py-1 bg-purple-600 text-white text-xs rounded-full font-medium flex items-center space-x-1">
                      <Brain className="w-3 h-3" />
                      <span>IA</span>
                    </div>
                  </div>
                )}
              </div>
              <div className="p-6">
                {/* Content */}
                <div className="flex items-center space-x-2 mb-3">
                  <TypeIcon className="w-5 h-5 text-slate-400" />
                  <span className="text-sm font-medium text-slate-900">{material.subject}</span>
                  <span className="text-sm text-slate-500">•</span>
                  <span className="text-sm text-slate-500">{material.grade}</span>
                </div>
                <h3 className="font-semibold text-slate-900 mb-2 line-clamp-2">
                  {material.title}
                </h3>
                <p className="text-slate-600 text-sm mb-4 leading-relaxed">
                  {material.description}
                </p>
                {/* Meta y Stats eliminados */}
                <div className="flex items-center justify-end text-xs text-slate-500 mb-4">
                  <span className="text-xs">{material.createdAt}</span>
                </div>
                {/* Actions */}
                <div className="flex space-x-2 items-center">
                  <button
                    className="px-3 py-2 border border-green-600 text-green-700 text-sm rounded-lg hover:bg-green-50 transition-colors duration-200 flex items-center space-x-1"
                    onClick={() => navigate('/plantillas')}
                  >
                    <span role="img" aria-label="usar">🚀</span>
                    <span>Usar</span>
                  </button>
                  <button
                    className="px-3 py-2 border border-slate-300 text-blue-700 text-sm rounded-lg hover:bg-blue-50 transition-colors duration-200 flex items-center space-x-1"
                    onClick={() => setInfoOpenId(infoOpenId === material.id ? null : material.id)}
                  >
                    <span role="img" aria-label="info">ℹ️</span>
                    <span>{infoOpenId === material.id ? 'Ocultar Información' : 'Ver Información'}</span>
                  </button>
                  <button
                    className="px-3 py-2 border border-slate-300 text-blue-700 text-sm rounded-lg hover:bg-blue-50 transition-colors duration-200 flex items-center space-x-1"
                    onClick={() => setShowVideo({ open: true, materialId: material.id })}
                  >
                    <span role="img" aria-label="video">🎬</span>
                    <span>Ver Video</span>
                  </button>
                  <a
                    href={pdfLinks[material.id] || '#'}
                    download
                    className="px-3 py-2 border border-slate-300 text-green-700 text-sm rounded-lg hover:bg-green-50 transition-colors duration-200 flex items-center space-x-1"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span role="img" aria-label="pdf">📄</span>
                    <span>Descargar PDF</span>
                  </a>
                </div>
                {/* Información desplegable dentro de la tarjeta */}
                {infoOpenId === material.id && (
                  <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h2 className="text-base font-bold text-slate-900 mb-2">Información del material</h2>
                    {material.keyConcepts && (
                      <div className="mb-2">
                        <span className="block font-semibold text-slate-800 text-xs mb-1">Conceptos clave:</span>
                        <ul className="list-disc list-inside text-xs text-slate-600">
                          {material.keyConcepts.map((concept, idx) => (
                            <li key={idx}>{concept}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {material.recommendedUse && (
                      <div className="mb-2">
                        <span className="block font-semibold text-slate-800 text-xs mb-1">Uso recomendado:</span>
                        <span className="text-xs text-slate-600">{material.recommendedUse}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal de Video */}
      {showVideo.open && showVideo.materialId && (
        <div
          className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50"
          onClick={() => setShowVideo({ open: false, materialId: null })}
        >
          <div
            className="bg-white rounded-xl shadow-lg p-6 max-w-lg w-full relative"
            onClick={e => e.stopPropagation()}
          >
            <button
              className="absolute top-2 right-2 text-slate-500 hover:text-slate-800 text-xl"
              onClick={() => setShowVideo({ open: false, materialId: null })}
              aria-label="Cerrar"
            >
              &times;
            </button>
            <div className="aspect-w-16 aspect-h-9 w-full mb-4">
              <iframe
                src={videoLinks[showVideo.materialId]}
                title="Video del material"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-64 rounded-lg border"
              ></iframe>
            </div>
            <div className="text-center">
              <span className="font-semibold text-slate-900">Video explicativo del material</span>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
  {materials.length === 0 && (
        <div className="text-center py-16">
          <BookOpen className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-slate-900 mb-2">
            No se encontraron materiales
          </h3>
          <p className="text-slate-600 mb-6">
            Intenta ajustar los filtros o generar nuevo material didáctico
          </p>
          <button className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 font-medium flex items-center space-x-2 mx-auto">
            <Plus className="w-5 h-5" />
            <span>Generar Nuevo Material</span>
          </button>
        </div>
      )}

      {/* AI Suggestion Card (opcional, puedes dejarlo o quitarlo) */}
      <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-6 border border-purple-200">
        <div className="flex items-center space-x-3 mb-4">
          <Brain className="w-6 h-6 text-purple-600" />
          <h3 className="text-lg font-bold text-slate-900">Sugerencia de IA</h3>
        </div>
        <p className="text-slate-700 mb-4">
          Basado en tu actividad reciente, la IA sugiere crear material interactivo sobre 
          <strong> "Teorema de Pitágoras" </strong> para complementar tu próxima planificación.
        </p>
        <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200 font-medium text-sm">
          Generar Material Sugerido
        </button>
      </div>
    </div>
  );
};

export default Materials;
