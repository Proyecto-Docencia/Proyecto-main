import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import '../css/Profile.css';
import { useAuth } from '../contexts/AuthContext';
import { fetchPlanificacionesIA, validarPlanificacionIA, crearChat } from '../utils/api';

interface Planificacion {
  id: number;
  titulo?: string;
  datos_generales?: string;
  objetivo_actividad?: string;
  fecha_creacion?: string;
  estado?: string;
  creado_en?: string;
  [key: string]: any;
}

interface Capitulo {
  nombre: string;
  archivo: string;
}

const VerificacionIA: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [planificaciones, setPlanificaciones] = useState<Planificacion[]>([]);
  const [planSeleccionada, setPlanSeleccionada] = useState<Planificacion | null>(null);
  const [capitulosSeleccionados, setCapitulosSeleccionados] = useState<string[]>([]);
  const [validando, setValidando] = useState(false);
  const [feedbackIA, setFeedbackIA] = useState<string>('');

  const capitulosDisponibles: Capitulo[] = [
    { nombre: 'Capítulo 2', archivo: 'Capitulo2.pdf' },
    { nombre: 'Capítulo 3', archivo: 'Capitulo3.pdf' },
    { nombre: 'Capítulo 4', archivo: 'Cápitulo4.pdf' },
    { nombre: 'Capítulo 5', archivo: 'Capítulo5.pdf' },
    { nombre: 'Capítulo 6', archivo: 'Capitulo6.pdf' }
  ];

  // Cargar planificaciones desde el backend
  useEffect(() => {
    const cargarPlanificaciones = async () => {
      try {
        const data = await fetchPlanificacionesIA();
        setPlanificaciones(data.planificaciones || []);
      } catch (error) {
        console.error('Error al cargar planificaciones:', error);
        alert('No se pudieron cargar las planificaciones');
      }
    };

    if (user) {
      cargarPlanificaciones();
    }
  }, [user]);

  const toggleCapitulo = (archivo: string) => {
    setCapitulosSeleccionados(prev => 
      prev.includes(archivo) 
        ? prev.filter(c => c !== archivo)
        : [...prev, archivo]
    );
  };

  const validarConIA = async () => {
    if (!planSeleccionada) {
      alert('Por favor selecciona una planificación');
      return;
    }

    if (capitulosSeleccionados.length === 0) {
      alert('Por favor selecciona al menos un capítulo para validar');
      return;
    }

    setValidando(true);
    setFeedbackIA('');

    try {
      // Preparar el contexto completo de la planificación
      const planificacionTexto = `
═══════════════════════════════════════════════════════════════
PLANIFICACIÓN EDUCATIVA CON IA GENERATIVA - A VALIDAR
═══════════════════════════════════════════════════════════════

📋 IDENTIFICACIÓN GENERAL:
${planSeleccionada.datos_generales || 'No especificado'}


🎯 DIAGNÓSTICO DE ESTUDIANTES:
${planSeleccionada.diagnostico_estudiantes || 'No especificado'}

👨‍🏫 AUTOEVALUACIÓN DOCENTE:
${planSeleccionada.habilidades_propias || 'No especificado'}

🎓 OBJETIVO DE APRENDIZAJE:
${planSeleccionada.objetivo_actividad || 'No especificado'}

⏰ CONTEXTO Y TEMPORALIDAD:
${planSeleccionada.contexto_temporalidad || 'No especificado'}

🤖 HERRAMIENTAS DE IA GENERATIVA:
${planSeleccionada.herramientas_iagen || 'No especificado'}

📚 METODOLOGÍA Y ESTRATEGIA:
${planSeleccionada.metodologia_estrategia || 'No especificado'}

✅ INDICADORES DE EVALUACIÓN:
${planSeleccionada.indicadores_evaluacion || 'No especificado'}

🚀 INICIO DE LA CLASE:
${planSeleccionada.inicio_clase || 'No especificado'}

💡 DESARROLLO DE LA CLASE:
${planSeleccionada.desarrollo_clase || 'No especificado'}

🏁 CIERRE DE LA CLASE:
${planSeleccionada.cierre_clase || 'No especificado'}

⚖️ ASPECTOS ÉTICOS:
${planSeleccionada.pilares_eticos || 'No especificado'}

📊 EVALUACIÓN:
${planSeleccionada.evaluacion_experiencia || 'No especificado'}

🔄 ACCIONES POSTERIORES:
${planSeleccionada.acciones_posteriores || 'No especificado'}
      `.trim();

      const capitulosTexto = capitulosSeleccionados.map(c => 
        capitulosDisponibles.find(cap => cap.archivo === c)?.nombre
      ).join(', ');

      const promptCompleto = `Actúa como un experto en diseño pedagógico y alfabetización digital en IA Generativa. 

Valida la siguiente planificación educativa comparándola con los principios y contenidos de los ${capitulosTexto} del material de "Alfabetización Digital en IA Generativa".

${planificacionTexto}

═══════════════════════════════════════════════════════════════
TU TAREA: Proporciona un FEEDBACK ESTRUCTURADO siguiendo EXACTAMENTE este formato:
═══════════════════════════════════════════════════════════════

📊 PUNTUACIÓN GENERAL: [X/10]
Califica la planificación del 1 al 10 considerando alineamiento con contenidos, claridad de objetivos, uso apropiado de IAGen, y diseño pedagógico.

✅ FORTALEZAS IDENTIFICADAS:
• [Lista 3-5 aspectos positivos de la planificación]
• [Aspectos que están bien diseñados y alineados con los capítulos]
• [Elementos que demuestran buena comprensión de IAGen en educación]

⚠️ ÁREAS DE MEJORA:
• [Lista 2-4 aspectos que necesitan mejorarse]
• [Elementos que no están claros o requieren desarrollo]
• [Aspectos que no están alineados con las mejores prácticas de los capítulos]

💡 RECOMENDACIONES ESPECÍFICAS:
1. [Recomendación concreta para mejorar X aspecto]
2. [Sugerencia específica sobre cómo implementar Y mejor]
3. [Consejo práctico basado en el contenido de los capítulos seleccionados]

🎯 ALINEAMIENTO CON LOS CAPÍTULOS:
• ${capitulosTexto}: [Analiza cómo la planificación se alinea con estos capítulos específicos]
• [Menciona conceptos clave de estos capítulos que están presentes o ausentes]
• [Sugiere cómo incorporar mejor los contenidos de estos capítulos]

🏆 CONCLUSIÓN Y PRÓXIMOS PASOS:
[Ofrece una conclusión clara sobre si la planificación está lista para implementarse O si necesita ajustes. Si está bien, di claramente "✅ Esta planificación está lista para implementarse". Si necesita mejoras, especifica qué debe hacerse antes de implementarla]

═══════════════════════════════════════════════════════════════

IMPORTANTE: 
- Sé específico y constructivo en tus comentarios
- Basa tus recomendaciones en los contenidos de los capítulos seleccionados
- Si algo está bien hecho, reconócelo claramente
- Si no hay problemas graves, indícalo claramente en la conclusión
- Proporciona ejemplos concretos cuando sea posible`;

      // Llamada al API del chatbot con RAG para obtener contexto de los capítulos
      const data = await crearChat(promptCompleto, null, true);
      const feedback = data.respuesta_ia || 'No se pudo obtener feedback de la IA';
      setFeedbackIA(feedback);

      // Guardar el feedback en el backend
      if (planSeleccionada?.id && feedback) {
        try {
          await validarPlanificacionIA(planSeleccionada.id, feedback, capitulosSeleccionados);
          console.log('Feedback guardado exitosamente en el backend');
        } catch (error) {
          console.error('Error al guardar feedback:', error);
          // No mostrar error al usuario ya que el feedback se muestra correctamente
        }
      }

    } catch (error) {
      console.error('Error al validar:', error);
      setFeedbackIA('❌ Error al conectar con la IA. Por favor intenta nuevamente.');
    } finally {
      setValidando(false);
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-wrapper">
        <div className="profile-header">
          <div className="profile-header-main">
            <div className="profile-avatar"><span>🤖</span></div>
            <div className="profile-header-info">
              <h1 className="profile-name">Validación con IA</h1>
              <p className="profile-role">Valida tu planificación con el material de Alfabetización Digital en IAGen</p>
            </div>
          </div>
        </div>

        <div style={{maxWidth: '1200px', margin: '0 auto', padding: '0 20px'}}>
          
          {/* SELECCIÓN DE PLANIFICACIÓN */}
          <section className="profile-section">
            <div className="profile-section-header">
              <h2 className="profile-section-title" style={{color: '#1e40af'}}>
                1. Selecciona tu Planificación
              </h2>
            </div>
            <div className="profile-fields">
              <div className="profile-field">
                {planificaciones.length === 0 ? (
                  <div style={{
                    padding: '24px',
                    textAlign: 'center',
                    backgroundColor: '#fef3c7',
                    borderRadius: '8px',
                    border: '2px dashed #f59e0b'
                  }}>
                    <p style={{margin: '0 0 12px 0', color: '#92400e'}}>
                      No tienes planificaciones guardadas
                    </p>
                    <button 
                      className="profile-edit-btn"
                      onClick={() => navigate('/planificacion/asistente-ia')}
                    >
                      Crear Nueva Planificación
                    </button>
                  </div>
                ) : (
                  <select
                    className="profile-input"
                    value={planSeleccionada?.id || ''}
                    onChange={(e) => {
                      const plan = planificaciones.find(p => p.id === parseInt(e.target.value));
                      setPlanSeleccionada(plan || null);
                      setFeedbackIA(''); // Limpiar feedback al cambiar planificación
                    }}
                    style={{
                      width: '100%',
                      padding: '12px',
                      fontSize: '16px',
                      borderRadius: '8px',
                      border: '2px solid #e5e7eb'
                    }}
                  >
                    <option value="">-- Selecciona una planificación --</option>
                    {planificaciones.map((plan) => {
                      const titulo = plan.titulo || 
                                   plan.datos_generales?.substring(0, 50) || 
                                   `Planificación ${plan.id}`;
                      const fecha = plan.fecha_creacion 
                        ? new Date(plan.fecha_creacion).toLocaleDateString()
                        : '';
                      return (
                        <option key={plan.id} value={plan.id}>
                          {titulo} {fecha && `(${fecha})`}
                        </option>
                      );
                    })}
                  </select>
                )}
              </div>

              {planSeleccionada && (
                <div className="profile-field" style={{marginTop: '16px'}}>
                  <div style={{
                    padding: '16px',
                    backgroundColor: '#f0f9ff',
                    borderRadius: '8px',
                    border: '1px solid #bfdbfe'
                  }}>
                    <h4 style={{margin: '0 0 8px 0', color: '#1e40af'}}>Vista Previa:</h4>
                    <p style={{margin: '4px 0', fontSize: '14px', color: '#475569'}}>
                      <strong>Datos generales:</strong> {planSeleccionada.datos_generales?.substring(0, 100) || 'No especificado'}...
                    </p>
                    <p style={{margin: '4px 0', fontSize: '14px', color: '#475569'}}>
                      <strong>Objetivo:</strong> {planSeleccionada.objetivo_actividad?.substring(0, 100) || 'No especificado'}...
                    </p>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* SELECCIÓN DE CAPÍTULOS */}
          <section className="profile-section" style={{marginTop: '24px'}}>
            <div className="profile-section-header">
              <h2 className="profile-section-title" style={{color: '#1e40af'}}>
                2. Selecciona los Capítulos para Validar
              </h2>
            </div>
            <div className="profile-fields">
              <p style={{color: '#6b7280', marginBottom: '16px', fontSize: '14px'}}>
                Selecciona los capítulos del material de Alfabetización Digital en IAGen con los que deseas validar tu planificación:
              </p>
              <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px'}}>
                {capitulosDisponibles.map((capitulo) => (
                  <div
                    key={capitulo.archivo}
                    onClick={() => toggleCapitulo(capitulo.archivo)}
                    style={{
                      padding: '16px',
                      borderRadius: '8px',
                      border: capitulosSeleccionados.includes(capitulo.archivo) 
                        ? '2px solid #3b82f6' 
                        : '2px solid #e5e7eb',
                      backgroundColor: capitulosSeleccionados.includes(capitulo.archivo) 
                        ? '#dbeafe' 
                        : '#ffffff',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      textAlign: 'center'
                    }}
                  >
                    <div style={{fontSize: '24px', marginBottom: '8px'}}>
                      {capitulosSeleccionados.includes(capitulo.archivo) ? '✅' : '📄'}
                    </div>
                    <div style={{fontWeight: '500', color: '#1f2937'}}>
                      {capitulo.nombre}
                    </div>
                  </div>
                ))}
              </div>
              
              {capitulosSeleccionados.length > 0 && (
                <div style={{
                  marginTop: '16px',
                  padding: '12px',
                  backgroundColor: '#f0f9ff',
                  borderRadius: '8px',
                  fontSize: '14px',
                  color: '#1e40af'
                }}>
                  ✓ {capitulosSeleccionados.length} capítulo(s) seleccionado(s)
                </div>
              )}
            </div>
          </section>

          {/* BOTÓN DE VALIDAR */}
          <div style={{
            marginTop: '32px',
            padding: '24px',
            backgroundColor: '#f8fafc',
            borderRadius: '12px',
            textAlign: 'center',
            border: '2px solid #e2e8f0'
          }}>
            <button
              className="profile-edit-btn editing"
              onClick={validarConIA}
              disabled={validando || !planSeleccionada || capitulosSeleccionados.length === 0}
              style={{
                fontSize: '18px',
                padding: '16px 32px',
                backgroundColor: validando ? '#94a3b8' : '#3b82f6',
                cursor: (validando || !planSeleccionada || capitulosSeleccionados.length === 0) ? 'not-allowed' : 'pointer',
                opacity: (validando || !planSeleccionada || capitulosSeleccionados.length === 0) ? 0.6 : 1
              }}
            >
              {validando ? '⏳ Validando con IA...' : '🤖 Validar con IA'}
            </button>
            {(!planSeleccionada || capitulosSeleccionados.length === 0) && (
              <p style={{marginTop: '12px', color: '#6b7280', fontSize: '14px'}}>
                {!planSeleccionada 
                  ? 'Selecciona una planificación para continuar' 
                  : 'Selecciona al menos un capítulo para validar'}
              </p>
            )}
          </div>

          {/* FEEDBACK DE LA IA */}
          {feedbackIA && (
            <section className="profile-section" style={{marginTop: '24px'}}>
              <div className="profile-section-header">
                <h2 className="profile-section-title" style={{color: '#059669'}}>
                  📝 Feedback de la IA
                </h2>
              </div>
              <div className="profile-fields">
                <div className="profile-field">
                  <div style={{
                    padding: '24px',
                    backgroundColor: '#ffffff',
                    borderRadius: '8px',
                    border: '2px solid #d1fae5',
                    lineHeight: '1.8',
                    fontSize: '15px',
                    color: '#1f2937'
                  }} className="prose prose-slate max-w-none">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {feedbackIA}
                    </ReactMarkdown>
                  </div>
                </div>

                {/* Botones de acción después del feedback */}
                <div style={{
                  marginTop: '24px',
                  display: 'flex',
                  gap: '12px',
                  justifyContent: 'center',
                  flexWrap: 'wrap'
                }}>
                  <button
                    className="profile-edit-btn"
                    onClick={() => {
                      setFeedbackIA('');
                      setPlanSeleccionada(null);
                      setCapitulosSeleccionados([]);
                    }}
                  >
                    🔄 Nueva Validación
                  </button>
                  <button
                    className="profile-edit-btn editing"
                    onClick={() => navigate('/planificacion/asistente-ia')}
                  >
                    ✏️ Editar Planificación
                  </button>
                  <button
                    className="profile-edit-btn"
                    onClick={() => navigate('/planificacion/mis-planificaciones')}
                  >
                    📚 Mis Planificaciones
                  </button>
                </div>
              </div>
            </section>
          )}

        </div>
      </div>
    </div>
  );
};

export default VerificacionIA;