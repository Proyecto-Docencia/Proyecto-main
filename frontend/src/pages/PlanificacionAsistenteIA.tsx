import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useChat } from '../hooks/useChat';
import MarkdownMessage from '../components/MarkdownMessage';
import '../css/Profile.css';

interface FormularioAsistenteIA {
  // Identificación general
  datos_generales: string;
  
  // Etapa 1: Diagnóstico
  diagnostico_estudiantes: string;
  brechas_estudiantes: string;
  habilidades_propias: string;
  
  // Paso 2: Planificar el Diseño
  objetivo_actividad: string;
  contexto_temporalidad: string;
  herramientas_iagen: string;
  metodologia_estrategia: string;
  indicadores_evaluacion: string;
  
  // Descripción de la clase
  inicio_clase: string;
  desarrollo_clase: string;
  cierre_clase: string;
  pilares_eticos: string;
  
  // Paso 3: Ejecutar la Experiencia
  registro_implementacion: string;
  
  // Paso 4: Evaluar la experiencia
  evaluacion_experiencia: string;
  
  // Paso 5: Asimilación
  acciones_posteriores: string;
  
  // Paso 6: Evaluación del ciclo completo
  facilitadores_obstaculos: string;
  reflexion_practica: string;
}

const PlanificacionAsistenteIA: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState<FormularioAsistenteIA>({
    datos_generales: '',
    diagnostico_estudiantes: '',
    brechas_estudiantes: '',
    habilidades_propias: '',
    objetivo_actividad: '',
    contexto_temporalidad: '',
    herramientas_iagen: '',
    metodologia_estrategia: '',
    indicadores_evaluacion: '',
    inicio_clase: '',
    desarrollo_clase: '',
    cierre_clase: '',
    pilares_eticos: '',
    registro_implementacion: '',
    evaluacion_experiencia: '',
    acciones_posteriores: '',
    facilitadores_obstaculos: '',
    reflexion_practica: ''
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [savedMsg, setSavedMsg] = useState<string>('');
  
  // Usar el hook useChat para compartir la sesión con Chatbot y Materials
  const {
    messages: chatMessages,
    input: chatInput,
    loading: isLoadingChat,
    setInput: setChatInput,
    sendMessage: sendChatMessage,
    chatEndRef
  } = useChat([
    {
      role: 'ai',
      text: '¡Hola! Soy tu asistente de IA para el diseño de experiencias de aprendizaje con IA Generativa. Estoy aquí para ayudarte en cada etapa de tu planificación. Puedes preguntarme sobre metodologías, herramientas, estrategias de evaluación, o cualquier duda que tengas. ¿En qué puedo ayudarte?'
    }
  ]);

  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const guardarBorrador = () => {
    localStorage.setItem(`planificacion_asistente_${user?.email}`, JSON.stringify(form));
    setSavedMsg('Borrador guardado');
    setTimeout(() => setSavedMsg(''), 2500);
  };

  const cargarBorrador = () => {
    const saved = localStorage.getItem(`planificacion_asistente_${user?.email}`);
    if (saved) {
      setForm(JSON.parse(saved));
    }
  };

  useEffect(() => {
    cargarBorrador();
  }, [user?.email]);

  const nextStep = () => {
    if (currentStep < 6) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  return (
    <div className="profile-container">
      <div className="profile-wrapper">
        <div className="profile-header" style={{alignItems:'center'}}>
          <div className="profile-header-main">
            <div className="profile-avatar"><span>IA</span></div>
            <div className="profile-header-info">
              <h1 className="profile-name">Planificación con Asistente IA</h1>
              <p className="profile-role">
                Diseño de experiencias de aprendizaje con IA Generativa - Etapa {currentStep} de 6
              </p>
            </div>
          </div>
          {savedMsg && (
            <div className="px-3 py-2 rounded" style={{background:'#dcfce7', color:'#166534', border:'1px solid #bbf7d0'}}>
              {savedMsg}
            </div>
          )}
        </div>

        <div style={{display: 'grid', gridTemplateColumns: '1fr 400px', gap: '24px', alignItems: 'start'}}>
          {/* Columna izquierda: Formulario de planificación */}
          <section className="profile-section">
            <div className="profile-section-header">
              <h2 className="profile-section-title">
                {currentStep === 1 && "Identificación General"}
                {currentStep === 2 && "Diagnóstico y Planificación"}
                {currentStep === 3 && "Estructura de la Clase"}
                {currentStep === 4 && "Ejecución de la Experiencia"}
                {currentStep === 5 && "Evaluación y Asimilación"}
                {currentStep === 6 && "Evaluación del Ciclo Completo"}
              </h2>
              <div style={{display:'flex', gap:'8px', alignItems:'center'}}>
                <button className="profile-edit-btn" onClick={guardarBorrador}>
                  💾 Guardar Borrador
                </button>
                {currentStep > 1 && (
                  <button className="profile-edit-btn" onClick={prevStep}>
                    ← Anterior
                  </button>
                )}
                {currentStep < 6 && (
                  <button 
                    className="profile-edit-btn" 
                    onClick={nextStep}
                    style={{
                      background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
                      color: 'white',
                      borderColor: '#1e3a8a'
                    }}
                  >
                    Siguiente →
                  </button>
                )}
                {currentStep === 6 && (
                  <button 
                    className="profile-edit-btn editing" 
                    onClick={() => {
                      guardarBorrador();
                      navigate('/planificacion/nueva');
                    }}
                  >
                    Ver Planificación Completa →
                  </button>
                )}
              </div>
            </div>

            <div className="profile-fields" style={{transition: 'opacity 0.3s ease'}}>

              {/* ETAPA 1: IDENTIFICACIÓN GENERAL */}
              {currentStep === 1 && (
                <>
                  <div className="profile-field">
                    <label className="profile-label">
                      <strong>1. Datos generales de su curso</strong>
                    </label>
                    <p style={{color: '#6b7280', fontSize: '14px', marginBottom: '8px'}}>
                      Registre los datos generales de su curso al cual diseña la experiencia de aprendizaje, 
                      por ejemplo: Carrera, asignatura, semestre o trimestre, otros.
                    </p>
                    <textarea
                      name="datos_generales"
                      value={form.datos_generales}
                      onChange={onChange}
                      className="profile-input"
                      rows={4}
                      placeholder="Ej: Carrera de Ingeniería en Informática, Asignatura: Programación Avanzada, Semestre: 5° semestre, Modalidad: Presencial..."
                    />
                  </div>
                </>
              )}

              {/* ETAPA 2: DIAGNÓSTICO Y PLANIFICACIÓN */}
              {currentStep === 2 && (
                <>
                  <div style={{marginBottom: '24px', padding: '16px', backgroundColor: '#f8fafc', borderRadius: '8px'}}>
                    <h3 style={{margin: '0 0 8px 0', color: '#1f2937'}}>
                      Paso 1: Diagnóstico del curso sobre habilidades digitales en IA generativa
                    </h3>
                  </div>

                  <div className="profile-field">
                    <label className="profile-label">
                      <strong>2. Diagnóstico de estudiantes</strong>
                    </label>
                    <p style={{color: '#6b7280', fontSize: '14px', marginBottom: '8px'}}>
                      Registre su diagnóstico sobre las fortalezas y debilidades. ¿Qué conocimientos básicos 
                      sobre IAGen tienen mis estudiantes? ¿Cuáles son las brechas más importantes en la 
                      comprensión o el uso de la IAGen para mis estudiantes en el contexto de mi asignatura?
                    </p>
                    <textarea
                      name="diagnostico_estudiantes"
                      value={form.diagnostico_estudiantes}
                      onChange={onChange}
                      className="profile-input"
                      rows={5}
                      placeholder="Describa las fortalezas y debilidades de sus estudiantes en relación a la IA generativa..."
                    />
                  </div>

                  <div className="profile-field">
                    <label className="profile-label">
                      <strong>3. Autoevaluación docente</strong>
                    </label>
                    <p style={{color: '#6b7280', fontSize: '14px', marginBottom: '8px'}}>
                      Registre sus propias habilidades y brechas. Es importante reconocer su propio diagnóstico 
                      para ajustar su proceso y proponer sus propias metas de superación o gestionar los apoyos que necesita.
                    </p>
                    <textarea
                      name="habilidades_propias"
                      value={form.habilidades_propias}
                      onChange={onChange}
                      className="profile-input"
                      rows={5}
                      placeholder="Reflexione sobre sus propias competencias en IA generativa y áreas de mejora..."
                    />
                  </div>

                  <div style={{marginBottom: '24px', padding: '16px', backgroundColor: '#f0f9ff', borderRadius: '8px'}}>
                    <h3 style={{margin: '0 0 8px 0', color: '#1f2937'}}>
                      Paso 2: Planificar el Diseño Detallado de la Actividad
                    </h3>
                  </div>

                  <div className="profile-field">
                    <label className="profile-label">
                      <strong>4. Objetivo de la actividad</strong>
                    </label>
                    <p style={{color: '#6b7280', fontSize: '14px', marginBottom: '8px'}}>
                      Formule un objetivo claro y medible para esta actividad, centrándose en el desarrollo de 
                      competencias de alfabetización digital en IAGen y en la tributación al programa de su asignatura.
                    </p>
                    <textarea
                      name="objetivo_actividad"
                      value={form.objetivo_actividad}
                      onChange={onChange}
                      className="profile-input"
                      rows={4}
                      placeholder="Ej: Al finalizar la actividad, los estudiantes serán capaces de utilizar herramientas de IA generativa para..."
                    />
                  </div>

                  <div className="profile-field">
                    <label className="profile-label">
                      <strong>5. Contexto y temporalidad</strong>
                    </label>
                    <p style={{color: '#6b7280', fontSize: '14px', marginBottom: '8px'}}>
                      Defina elementos que dan contexto y temporalidad: lugar, cuándo, duración, 
                      contenidos disciplinares, integración de habilidades en IAGen, otros aspectos necesarios.
                    </p>
                    <textarea
                      name="contexto_temporalidad"
                      value={form.contexto_temporalidad}
                      onChange={onChange}
                      className="profile-input"
                      rows={5}
                      placeholder="Lugar: Laboratorio de informática. Duración: 90 minutos. Contenidos: Algoritmos de búsqueda..."
                    />
                  </div>

                  <div className="profile-field">
                    <label className="profile-label">
                      <strong>6. Herramientas de IAGen y Escenarios</strong>
                    </label>
                    <p style={{color: '#6b7280', fontSize: '14px', marginBottom: '8px'}}>
                      Seleccione las Herramientas de IAGen y Diseñe posibles Escenarios de Exploración. 
                      ¿Con qué IAGen va a trabajar? Pruebe y decida: Gemini, Claude, NotebookLM, otra? 
                      ¿Cuáles son los ejercicios o escenarios que van a desarrollar?
                    </p>
                    <textarea
                      name="herramientas_iagen"
                      value={form.herramientas_iagen}
                      onChange={onChange}
                      className="profile-input"
                      rows={5}
                      placeholder="Herramientas seleccionadas: ChatGPT, Gemini. Escenarios: Generación de código, revisión de algoritmos..."
                    />
                  </div>

                  <div className="profile-field">
                    <label className="profile-label">
                      <strong>7. Metodología y estrategia</strong>
                    </label>
                    <p style={{color: '#6b7280', fontSize: '14px', marginBottom: '8px'}}>
                      Defina una metodología, estrategia o forma de abordar su clase y descríbala resumidamente.
                    </p>
                    <textarea
                      name="metodologia_estrategia"
                      value={form.metodologia_estrategia}
                      onChange={onChange}
                      className="profile-input"
                      rows={4}
                      placeholder="Metodología activa basada en exploración guiada, trabajo colaborativo y reflexión crítica..."
                    />
                  </div>

                  <div className="profile-field">
                    <label className="profile-label">
                      <strong>8. Indicadores de evaluación</strong>
                    </label>
                    <p style={{color: '#6b7280', fontSize: '14px', marginBottom: '8px'}}>
                      Defina los indicadores de evaluación que le permitirán evaluar su objetivo y monitorear 
                      resultados. Acciones cognitivas, sociales o físicas observables y medibles.
                    </p>
                    <textarea
                      name="indicadores_evaluacion"
                      value={form.indicadores_evaluacion}
                      onChange={onChange}
                      className="profile-input"
                      rows={5}
                      placeholder="1. Formula prompts efectivos para la IA. 2. Evalúa críticamente las respuestas generadas. 3. Integra herramientas de IA en su proceso de resolución..."
                    />
                  </div>
                </>
              )}

              {/* ETAPA 3: ESTRUCTURA DE LA CLASE */}
              {currentStep === 3 && (
                <>
                  <div className="profile-field">
                    <label className="profile-label">
                      <strong>9. Inicio de la clase</strong>
                    </label>
                    <p style={{color: '#6b7280', fontSize: '14px', marginBottom: '8px'}}>
                      Describa cómo será el inicio de su clase. Motive, enganche, desafíe.
                    </p>
                    <textarea
                      name="inicio_clase"
                      value={form.inicio_clase}
                      onChange={onChange}
                      className="profile-input"
                      rows={5}
                      placeholder="Actividad de apertura: Presentación de un problema real que requiere el uso de IA generativa. Preguntas provocadoras sobre..."
                    />
                  </div>

                  <div className="profile-field">
                    <label className="profile-label">
                      <strong>10. Desarrollo de la clase</strong>
                    </label>
                    <p style={{color: '#6b7280', fontSize: '14px', marginBottom: '8px'}}>
                      Describa cómo será el desarrollo de su clase. Espacio para practicar, interactuar, etc.
                    </p>
                    <textarea
                      name="desarrollo_clase"
                      value={form.desarrollo_clase}
                      onChange={onChange}
                      className="profile-input"
                      rows={6}
                      placeholder="Exploración guiada de herramientas de IA. Trabajo en grupos pequeños. Experimentación práctica con casos reales..."
                    />
                  </div>

                  <div className="profile-field">
                    <label className="profile-label">
                      <strong>11. Cierre de la clase</strong>
                    </label>
                    <p style={{color: '#6b7280', fontSize: '14px', marginBottom: '8px'}}>
                      Describa cómo será el cierre de su clase. Compartir hallazgos y conceptualizar aprendizajes.
                    </p>
                    <textarea
                      name="cierre_clase"
                      value={form.cierre_clase}
                      onChange={onChange}
                      className="profile-input"
                      rows={5}
                      placeholder="Presentación de hallazgos por grupos. Síntesis de aprendizajes clave. Reflexión sobre limitaciones y potencialidades..."
                    />
                  </div>

                  <div className="profile-field">
                    <label className="profile-label">
                      <strong>12. Pilares éticos en la planificación</strong>
                    </label>
                    <p style={{color: '#6b7280', fontSize: '14px', marginBottom: '8px'}}>
                      Considere los Pilares Éticos en la Planificación. Revise su planificación y chequee el desarrollo, 
                      recuerde y modele aspectos éticos y de integridad académica. Registre algún recordatorio importante.
                    </p>
                    <textarea
                      name="pilares_eticos"
                      value={form.pilares_eticos}
                      onChange={onChange}
                      className="profile-input"
                      rows={5}
                      placeholder="Aspectos éticos a considerar: Transparencia en el uso de IA, citación apropiada, sesgos algorítmicos, privacidad de datos..."
                    />
                  </div>
                </>
              )}

              {/* ETAPA 4: EJECUCIÓN */}
              {currentStep === 4 && (
                <>
                  <div style={{marginBottom: '24px', padding: '16px', backgroundColor: '#f0fdf4', borderRadius: '8px'}}>
                    <h3 style={{margin: '0 0 8px 0', color: '#1f2937'}}>
                      Paso 3: Ejecutar la Experiencia de Aprendizaje
                    </h3>
                    <p style={{color: '#6b7280', fontSize: '14px', margin: 0}}>
                      Esta es la fase de implementación de su planificación en el aula o entorno de aprendizaje.
                    </p>
                  </div>

                  <div className="profile-field">
                    <label className="profile-label">
                      <strong>13. Registro de implementación</strong>
                    </label>
                    <p style={{color: '#6b7280', fontSize: '14px', marginBottom: '8px'}}>
                      Lleve a cabo la actividad según su planificación. Sea un facilitador y observador, 
                      permitiendo la exploración del estudiante. Registre ideas que no desee olvidar u otros aspectos importantes.
                    </p>
                    <textarea
                      name="registro_implementacion"
                      value={form.registro_implementacion}
                      onChange={onChange}
                      className="profile-input"
                      rows={6}
                      placeholder="Observaciones durante la implementación: Reacciones de los estudiantes, dificultades encontradas, momentos destacados..."
                    />
                  </div>

                  <div style={{marginBottom: '24px', padding: '16px', backgroundColor: '#fefce8', borderRadius: '8px'}}>
                    <h3 style={{margin: '0 0 8px 0', color: '#1f2937'}}>
                      Paso 4: Evaluar la experiencia de aprendizaje implementada
                    </h3>
                    <p style={{color: '#6b7280', fontSize: '14px', margin: 0}}>
                      Esta etapa se centra en la verificación del logro del objetivo, identificar el logro de los estudiantes y evaluar el desarrollo de su planificación.
                    </p>
                  </div>

                  <div className="profile-field">
                    <label className="profile-label">
                      <strong>17. Evaluación de la experiencia</strong>
                    </label>
                    <p style={{color: '#6b7280', fontSize: '14px', marginBottom: '8px'}}>
                      Registre cómo va a evaluar la experiencia que ha diseñado. Cómo utilizarán sus estudiantes o usted 
                      el instrumento de evaluación diseñado. Fomente la reflexión, autoevaluación o evaluación entre pares.
                    </p>
                    <textarea
                      name="evaluacion_experiencia"
                      value={form.evaluacion_experiencia}
                      onChange={onChange}
                      className="profile-input"
                      rows={6}
                      placeholder="Instrumentos de evaluación: Rúbricas de autoevaluación, reflexión grupal, portafolio digital..."
                    />
                  </div>
                </>
              )}

              {/* ETAPA 5: ASIMILACIÓN */}
              {currentStep === 5 && (
                <>
                  <div style={{marginBottom: '24px', padding: '16px', backgroundColor: '#f5f3ff', borderRadius: '8px'}}>
                    <h3 style={{margin: '0 0 8px 0', color: '#1f2937'}}>
                      Paso 5: Asimilación de la experiencia de aprendizaje
                    </h3>
                    <p style={{color: '#6b7280', fontSize: '14px', margin: 0}}>
                      El objetivo es consolidar el aprendizaje y generar la asimilación del conocimiento práctico 
                      en un concepto teórico-aplicado, a través de la repetición y transferencia.
                    </p>
                  </div>

                  <div className="profile-field">
                    <label className="profile-label">
                      <strong>18. Acciones posteriores para consolidación</strong>
                    </label>
                    <p style={{color: '#6b7280', fontSize: '14px', marginBottom: '8px'}}>
                      ¿Qué acciones podría implementar posterior a la experiencia planificada, en clases posteriores 
                      de manera presencial o asincrónica para que sus estudiantes repitan lo aprendido o transfieran 
                      a otras acciones similares? El objetivo es consolidar las habilidades de alfabetización en IAGen.
                    </p>
                    <textarea
                      name="acciones_posteriores"
                      value={form.acciones_posteriores}
                      onChange={onChange}
                      className="profile-input"
                      rows={6}
                      placeholder="Actividades de seguimiento: Proyecto aplicado, casos de estudio adicionales, comunidad de práctica..."
                    />
                  </div>
                </>
              )}

              {/* ETAPA 6: EVALUACIÓN DEL CICLO COMPLETO */}
              {currentStep === 6 && (
                <>
                  <div style={{marginBottom: '24px', padding: '16px', backgroundColor: '#fef2f2', borderRadius: '8px'}}>
                    <h3 style={{margin: '0 0 8px 0', color: '#1f2937'}}>
                      Paso 6: Evaluación del ciclo completo
                    </h3>
                    <p style={{color: '#6b7280', fontSize: '14px', margin: 0}}>
                      El objetivo es mirar en retrospectiva el ciclo completo para identificar mejoras, aciertos y proyecciones.
                    </p>
                  </div>

                  <div className="profile-field">
                    <label className="profile-label">
                      <strong>19. Facilitadores y obstáculos</strong>
                    </label>
                    <p style={{color: '#6b7280', fontSize: '14px', marginBottom: '8px'}}>
                      Preguntas para facilitar la reflexión y proyección:<br/>
                      • ¿Cuáles fueron los facilitadores u obstáculos en el ciclo planificado?<br/>
                      • ¿Qué tan fluida fue la integración de las herramientas digitales?<br/>
                      • ¿Los estudiantes demostraron comprensión clara de qué es la IAGen y cómo funciona?<br/>
                      • ¿Identificaron sus limitaciones y sesgos?
                    </p>
                    <textarea
                      name="facilitadores_obstaculos"
                      value={form.facilitadores_obstaculos}
                      onChange={onChange}
                      className="profile-input"
                      rows={7}
                      placeholder="Reflexión sobre facilitadores y obstáculos encontrados durante todo el ciclo..."
                    />
                  </div>

                  <div className="profile-field">
                    <label className="profile-label">
                      <strong>20. Reflexión sobre la práctica docente</strong>
                    </label>
                    <p style={{color: '#6b7280', fontSize: '14px', marginBottom: '8px'}}>
                      Preguntas para reflexionar sobre su propia práctica:<br/>
                      • ¿De qué manera esta experiencia transformó tu enseñanza?<br/>
                      • ¿Qué nuevas experiencias de aprendizaje digital podrían iniciar?<br/>
                      • ¿Qué apoyo adicional necesitaría yo o mis estudiantes para seguir profundizando?<br/>
                      Utilice estos aprendizajes para ajustar futuras planificaciones.
                    </p>
                    <textarea
                      name="reflexion_practica"
                      value={form.reflexion_practica}
                      onChange={onChange}
                      className="profile-input"
                      rows={7}
                      placeholder="Reflexión personal sobre transformación de la práctica docente y proyecciones futuras..."
                    />
                  </div>

                  <div style={{marginTop: '24px', padding: '16px', backgroundColor: '#f0f9ff', borderRadius: '8px', textAlign: 'center'}}>
                    <h3 style={{margin: '0 0 8px 0', color: '#1f2937'}}>
                      🎉 ¡Felicitaciones!
                    </h3>
                    <p style={{color: '#6b7280', fontSize: '14px', margin: '0 0 16px 0'}}>
                      Has completado el diseño completo de tu experiencia de aprendizaje con IA Generativa. 
                      Haz clic en "Ver Planificación Completa" para ver el resumen de tu trabajo.
                    </p>
                  </div>
                </>
              )}
            </div>
          </section>

          {/* Columna derecha: Chat con IA (siempre visible y sticky) */}
          <div style={{position: 'sticky', top: '20px'}}>
            <div style={{
              border: '1px solid #e5e7eb',
              borderRadius: '12px',
              backgroundColor: 'white',
              overflow: 'hidden',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
            }}>
              {/* Header del chat */}
              <div style={{
                padding: '16px',
                borderBottom: '1px solid #e5e7eb',
                background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
                color: 'white'
              }}>
                <h3 style={{margin: 0, fontSize: '16px', fontWeight: 'bold'}}>
                  🤖 Asistente IA
                </h3>
                <p style={{margin: '4px 0 0 0', fontSize: '12px', opacity: 0.9}}>
                  Etapa {currentStep} de 6
                </p>
              </div>

              {/* Mensajes del chat */}
              <div style={{
                height: 'calc(100vh - 400px)',
                minHeight: '400px',
                maxHeight: '600px',
                padding: '16px',
                overflowY: 'auto',
                backgroundColor: '#f8fafc',
                transition: 'all 0.3s ease'
              }}>
                {chatMessages.map((message, index) => (
                  <div
                    key={`msg-${index}`}
                    style={{
                      marginBottom: '12px',
                      display: 'flex',
                      justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start'
                    }}
                  >
                    <div style={{
                      maxWidth: '85%',
                      padding: '10px 14px',
                      borderRadius: '12px',
                      backgroundColor: message.role === 'user' ? '#2563eb' : '#ffffff',
                      color: message.role === 'user' ? 'white' : '#1f2937',
                      fontSize: '14px',
                      lineHeight: '1.5',
                      boxShadow: message.role === 'ai' ? '0 1px 3px rgba(0,0,0,0.1)' : '0 1px 2px rgba(0,0,0,0.05)',
                      transition: 'all 0.2s ease'
                    }}>
                      <MarkdownMessage content={message.text} isUser={message.role === 'user'} />
                    </div>
                  </div>
                ))}
                {isLoadingChat && (
                  <div style={{
                    display: 'flex',
                    justifyContent: 'flex-start',
                    marginBottom: '12px'
                  }}>
                    <div style={{
                      padding: '10px 14px',
                      borderRadius: '12px',
                      backgroundColor: '#ffffff',
                      color: '#6b7280',
                      fontSize: '14px',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                    }}>
                      ⏳ Pensando...
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Input del chat */}
              <div style={{
                padding: '16px',
                borderTop: '1px solid #e5e7eb',
                backgroundColor: 'white'
              }}>
                <p style={{
                  margin: '0 0 8px 0',
                  fontSize: '12px',
                  color: '#6b7280'
                }}>
                  Pregunta sobre metodología, herramientas, evaluación...
                </p>
                <div style={{display: 'flex', gap: '8px'}}>
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && !isLoadingChat && sendChatMessage()}
                    placeholder="Escribe tu pregunta..."
                    style={{
                      flex: 1,
                      padding: '10px 12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '14px',
                      outline: 'none'
                    }}
                    disabled={isLoadingChat}
                  />
                  <button
                    onClick={sendChatMessage}
                    disabled={isLoadingChat || !chatInput.trim()}
                    style={{
                      padding: '10px 16px',
                      backgroundColor: '#3b82f6',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: isLoadingChat || !chatInput.trim() ? 'not-allowed' : 'pointer',
                      fontSize: '14px',
                      fontWeight: 'bold',
                      opacity: isLoadingChat || !chatInput.trim() ? 0.5 : 1,
                      transition: 'opacity 0.2s'
                    }}
                  >
                    Enviar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanificacionAsistenteIA;