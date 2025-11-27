import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { crearPlanificacionIA } from '../utils/api';
import '../css/Profile.css';

interface FormularioAsistenteIA {
  datos_generales: string;
  diagnostico_estudiantes: string;
  brechas_estudiantes: string;
  habilidades_propias: string;
  objetivo_actividad: string;
  contexto_temporalidad: string;
  herramientas_iagen: string;
  metodologia_estrategia: string;
  indicadores_evaluacion: string;
  inicio_clase: string;
  desarrollo_clase: string;
  cierre_clase: string;
  pilares_eticos: string;
  registro_implementacion: string;
  evaluacion_experiencia: string;
  acciones_posteriores: string;
  facilitadores_obstaculos: string;
  reflexion_practica: string;
}

// Función para mapear las respuestas del formulario
const mapearRespuestasAPlanificacion = (respuestas: FormularioAsistenteIA) => {
  return {
    // Pregunta 1
    datos_generales: respuestas.datos_generales,
    // Pregunta 2
    diagnostico_estudiantes: respuestas.diagnostico_estudiantes,
    // Pregunta 3
    habilidades_propias: respuestas.habilidades_propias,
    // Pregunta 4
    objetivo_actividad: respuestas.objetivo_actividad,
    // Pregunta 5
    contexto_temporalidad: respuestas.contexto_temporalidad,
    // Pregunta 6
    herramientas_iagen: respuestas.herramientas_iagen,
    // Pregunta 7
    metodologia_estrategia: respuestas.metodologia_estrategia,
    // Pregunta 8
    indicadores_evaluacion: respuestas.indicadores_evaluacion,
    // Pregunta 9
    inicio_clase: respuestas.inicio_clase,
    // Pregunta 10
    desarrollo_clase: respuestas.desarrollo_clase,
    // Pregunta 11
    cierre_clase: respuestas.cierre_clase,
    // Pregunta 12
    pilares_eticos: respuestas.pilares_eticos,
    // Pregunta 13
    registro_implementacion: respuestas.registro_implementacion,
    // Pregunta 17
    evaluacion_experiencia: respuestas.evaluacion_experiencia,
    // Pregunta 18
    acciones_posteriores: respuestas.acciones_posteriores,
    // Pregunta 19
    facilitadores_obstaculos: respuestas.facilitadores_obstaculos,
    // Pregunta 20
    reflexion_practica: respuestas.reflexion_practica
  };
};

const VerPlanificacionAsistente: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [planificacion, setPlanificacion] = useState<FormularioAsistenteIA | null>(null);
  const [planificacionMapeada, setPlanificacionMapeada] = useState<any>(null);
  const [guardandoPlanificacion, setGuardandoPlanificacion] = useState(false);
  const [mensajeGuardado, setMensajeGuardado] = useState<string>('');

  const guardarPlanificacion = async () => {
    if (!planificacion || !user) return;

    setGuardandoPlanificacion(true);
    setMensajeGuardado('');

    try {
      // Guardar en el backend usando la API
      await crearPlanificacionIA({
        estado: 'completada',
        datos_generales: planificacion.datos_generales,
        diagnostico_estudiantes: planificacion.diagnostico_estudiantes,
        habilidades_propias: planificacion.habilidades_propias,
        objetivo_actividad: planificacion.objetivo_actividad,
        contexto_temporalidad: planificacion.contexto_temporalidad,
        herramientas_iagen: planificacion.herramientas_iagen,
        metodologia_estrategia: planificacion.metodologia_estrategia,
        indicadores_evaluacion: planificacion.indicadores_evaluacion,
        inicio_clase: planificacion.inicio_clase,
        desarrollo_clase: planificacion.desarrollo_clase,
        cierre_clase: planificacion.cierre_clase,
        pilares_eticos: planificacion.pilares_eticos,
        registro_implementacion: planificacion.registro_implementacion,
        evaluacion_experiencia: planificacion.evaluacion_experiencia,
        acciones_posteriores: planificacion.acciones_posteriores,
        facilitadores_obstaculos: planificacion.facilitadores_obstaculos,
        reflexion_practica: planificacion.reflexion_practica,
      });

      // Limpiar localStorage después de guardar exitosamente
      localStorage.removeItem('formulario_borrador');

      setMensajeGuardado('✅ Planificación guardada exitosamente');
      // Ya no redirigir, solo mostrar mensaje
      setTimeout(() => {
        setMensajeGuardado('');
      }, 3000);

    } catch (error) {
      console.error('Error al guardar planificación:', error);
      setMensajeGuardado('❌ Error al guardar la planificación');
      setTimeout(() => setMensajeGuardado(''), 3000);
    } finally {
      setGuardandoPlanificacion(false);
    }
  };

  useEffect(() => {
    // Cargar planificación desde localStorage
    const saved = localStorage.getItem(`planificacion_asistente_${user?.email}`);
    console.log('Cargando planificación para:', user?.email);
    console.log('Datos guardados:', saved);
    if (saved) {
      const data = JSON.parse(saved);
      console.log('Datos parseados:', data);
      setPlanificacion(data);
      const mapeado = mapearRespuestasAPlanificacion(data);
      console.log('Datos mapeados:', mapeado);
      setPlanificacionMapeada(mapeado);
    } else {
      // Si no hay planificación guardada, redirigir al asistente
      console.log('No hay planificación guardada, redirigiendo...');
      navigate('/planificacion/asistente-ia');
    }
  }, [user?.email, navigate]);

  if (!planificacion || !planificacionMapeada) {
    return (
      <div className="profile-container">
        <div className="profile-wrapper">
          <div className="profile-section">
            <p>Cargando planificación...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-wrapper">
        <div className="profile-header">
          <div className="profile-header-main">
            <div className="profile-avatar"><span>📋</span></div>
            <div className="profile-header-info">
              <h1 className="profile-name">Resultado de mi Planificación</h1>
              <p className="profile-role">Diseño de experiencia de aprendizaje con IA Generativa</p>
            </div>
          </div>
          <div style={{display: 'flex', gap: '8px'}}>
            <button 
              className="profile-edit-btn"
              onClick={() => navigate('/planificacion/asistente-ia')}
            >
              ← Editar Planificación
            </button>
            <button 
              className="profile-edit-btn editing"
              onClick={() => navigate('/planificacion/verificacion')}
            >
              Validar con IA →
            </button>
          </div>
        </div>

        <div style={{maxWidth: '1200px', margin: '0 auto', padding: '0 20px'}}>
          <section className="profile-section">

            {/* IDENTIFICACIÓN GENERAL */}
            <div className="profile-section-header">
              <h2 className="profile-section-title" style={{color: '#1e40af'}}>
                IDENTIFICACIÓN GENERAL
              </h2>
            </div>
            <div className="profile-fields">
              <div className="profile-field">
                <div className="profile-value" style={{
                  whiteSpace: 'pre-wrap',
                  padding: '16px',
                  backgroundColor: '#f8fafc',
                  borderLeft: '4px solid #3b82f6',
                  borderRadius: '4px'
                }}>
                  {planificacionMapeada?.datos_generales || 'No especificado'}
                </div>
              </div>
            </div>

            {/* ETAPA 1: DIAGNÓSTICO */}
            <div className="profile-section-header" style={{marginTop: '32px'}}>
              <h2 className="profile-section-title" style={{color: '#1e40af'}}>
                ETAPA 1: DIAGNÓSTICO DEL CURSO Y A NIVEL PERSONAL SOBRE LAS HABILIDADES DIGITALES EN EL USO DE LA IA GENERATIVA
              </h2>
            </div>
            <div className="profile-fields">
              <div className="profile-field">
                <h3 style={{
                  margin: '0 0 12px 0',
                  fontSize: '16px',
                  color: '#475569',
                  fontWeight: '600'
                }}>
                  Diagnóstico sobre fortalezas y debilidades de los estudiantes
                </h3>
                <div className="profile-value" style={{
                  whiteSpace: 'pre-wrap',
                  padding: '16px',
                  backgroundColor: '#fef3c7',
                  borderLeft: '4px solid #f59e0b',
                  borderRadius: '4px'
                }}>
                  {planificacionMapeada?.diagnostico_estudiantes || 'No especificado'}
                </div>
              </div>

              <div className="profile-field" style={{marginTop: '20px'}}>
                <h3 style={{
                  margin: '0 0 12px 0',
                  fontSize: '16px',
                  color: '#475569',
                  fontWeight: '600'
                }}>
                  Autoevaluación docente: sus propias habilidades y brechas
                </h3>
                <div className="profile-value" style={{
                  whiteSpace: 'pre-wrap',
                  padding: '16px',
                  backgroundColor: '#fef3c7',
                  borderLeft: '4px solid #f59e0b',
                  borderRadius: '4px'
                }}>
                  {planificacionMapeada?.habilidades_propias || 'No especificado'}
                </div>
              </div>
            </div>

            {/* PASO 2: PLANIFICAR EL DISEÑO */}
            <div className="profile-section-header" style={{marginTop: '32px'}}>
              <h2 className="profile-section-title" style={{color: '#1e40af'}}>
                PASO 2: PLANIFICAR EL DISEÑO
              </h2>
            </div>
            <div className="profile-fields">
              
              <div className="profile-field">
                <h3 style={{
                  margin: '0 0 12px 0',
                  fontSize: '16px',
                  color: '#475569',
                  fontWeight: '600'
                }}>
                  Objetivo claro y medible de la actividad
                </h3>
                <div className="profile-value" style={{
                  whiteSpace: 'pre-wrap',
                  padding: '16px',
                  backgroundColor: '#dbeafe',
                  borderLeft: '4px solid #3b82f6',
                  borderRadius: '4px'
                }}>
                  {planificacionMapeada?.objetivo_actividad || 'No especificado'}
                </div>
              </div>

              <div className="profile-field" style={{marginTop: '20px'}}>
                <h3 style={{
                  margin: '0 0 12px 0',
                  fontSize: '16px',
                  color: '#475569',
                  fontWeight: '600'
                }}>
                  Contexto y temporalidad de la experiencia
                </h3>
                <div className="profile-value" style={{
                  whiteSpace: 'pre-wrap',
                  padding: '16px',
                  backgroundColor: '#dbeafe',
                  borderLeft: '4px solid #3b82f6',
                  borderRadius: '4px'
                }}>
                  {planificacionMapeada?.contexto_temporalidad || 'No especificado'}
                </div>
              </div>

              <div className="profile-field" style={{marginTop: '28px'}}>
                <h3 style={{
                  margin: '0 0 12px 0',
                  fontSize: '17px',
                  color: '#1e40af',
                  fontWeight: '600'
                }}>
                  RECURSOS A UTILIZAR
                </h3>
                <div className="profile-value" style={{
                  whiteSpace: 'pre-wrap',
                  padding: '16px',
                  backgroundColor: '#f3e8ff',
                  borderLeft: '4px solid #8b5cf6',
                  borderRadius: '4px'
                }}>
                  {planificacionMapeada?.herramientas_iagen || 'No especificado'}
                </div>
              </div>

              <div className="profile-field" style={{marginTop: '28px'}}>
                <h3 style={{
                  margin: '0 0 12px 0',
                  fontSize: '17px',
                  color: '#1e40af',
                  fontWeight: '600'
                }}>
                  METODOLOGÍA O ESTRATEGIAS
                </h3>
                <div className="profile-value" style={{
                  whiteSpace: 'pre-wrap',
                  padding: '16px',
                  backgroundColor: '#d1fae5',
                  borderLeft: '4px solid #10b981',
                  borderRadius: '4px'
                }}>
                  {planificacionMapeada?.metodologia_estrategia || 'No especificado'}
                </div>
              </div>

              <div className="profile-field" style={{marginTop: '28px'}}>
                <h3 style={{
                  margin: '0 0 12px 0',
                  fontSize: '17px',
                  color: '#1e40af',
                  fontWeight: '600'
                }}>
                  INDICADORES DE EVALUACIÓN
                </h3>
                <div className="profile-value" style={{
                  whiteSpace: 'pre-wrap',
                  padding: '16px',
                  backgroundColor: '#fce7f3',
                  borderLeft: '4px solid #ec4899',
                  borderRadius: '4px'
                }}>
                  {planificacionMapeada?.indicadores_evaluacion || 'No especificado'}
                </div>
              </div>

              <div className="profile-field" style={{marginTop: '28px'}}>
                <h3 style={{
                  margin: '0 0 12px 0',
                  fontSize: '17px',
                  color: '#1e40af',
                  fontWeight: '600'
                }}>
                  INICIO DE SU CLASE
                </h3>
                <div className="profile-value" style={{
                  whiteSpace: 'pre-wrap',
                  padding: '16px',
                  backgroundColor: '#fef3c7',
                  borderLeft: '4px solid #f59e0b',
                  borderRadius: '4px'
                }}>
                  {planificacionMapeada?.inicio_clase || 'No especificado'}
                </div>
              </div>

              <div className="profile-field" style={{marginTop: '28px'}}>
                <h3 style={{
                  margin: '0 0 12px 0',
                  fontSize: '17px',
                  color: '#1e40af',
                  fontWeight: '600'
                }}>
                  DESARROLLO DE SU CLASE
                </h3>
                <div className="profile-value" style={{
                  whiteSpace: 'pre-wrap',
                  padding: '16px',
                  backgroundColor: '#dbeafe',
                  borderLeft: '4px solid #3b82f6',
                  borderRadius: '4px'
                }}>
                  {planificacionMapeada?.desarrollo_clase || 'No especificado'}
                </div>
              </div>

              <div className="profile-field" style={{marginTop: '28px'}}>
                <h3 style={{
                  margin: '0 0 12px 0',
                  fontSize: '17px',
                  color: '#1e40af',
                  fontWeight: '600'
                }}>
                  CIERRE DE SU CLASE
                </h3>
                <div className="profile-value" style={{
                  whiteSpace: 'pre-wrap',
                  padding: '16px',
                  backgroundColor: '#d1fae5',
                  borderLeft: '4px solid #10b981',
                  borderRadius: '4px'
                }}>
                  {planificacionMapeada?.cierre_clase || 'No especificado'}
                </div>
              </div>

              <div className="profile-field" style={{marginTop: '28px'}}>
                <h3 style={{
                  margin: '0 0 12px 0',
                  fontSize: '17px',
                  color: '#1e40af',
                  fontWeight: '600'
                }}>
                  REFUERZO DE LOS PILARES
                </h3>
                <div className="profile-value" style={{
                  whiteSpace: 'pre-wrap',
                  padding: '16px',
                  backgroundColor: '#fce7f3',
                  borderLeft: '4px solid #ec4899',
                  borderRadius: '4px'
                }}>
                  {planificacionMapeada?.pilares_eticos || 'No especificado'}
                </div>
              </div>
            </div>

            {/* PASO 3: EJECUTAR LA EXPERIENCIA */}
            <div className="profile-section-header" style={{marginTop: '32px'}}>
              <h2 className="profile-section-title" style={{color: '#1e40af'}}>
                PASO 3: EJECUTAR LA EXPERIENCIA DE APRENDIZAJE
              </h2>
            </div>
            <div className="profile-fields">
              <div className="profile-field">
                <div className="profile-value" style={{
                  whiteSpace: 'pre-wrap',
                  padding: '16px',
                  backgroundColor: '#f3e8ff',
                  borderLeft: '4px solid #8b5cf6',
                  borderRadius: '4px'
                }}>
                  {planificacionMapeada?.registro_implementacion || 'No especificado'}
                </div>
              </div>
            </div>

            {/* PASO 4: EVALUAR LA EXPERIENCIA */}
            <div className="profile-section-header" style={{marginTop: '32px'}}>
              <h2 className="profile-section-title" style={{color: '#1e40af'}}>
                PASO 4: EVALUAR LA EXPERIENCIA DE APRENDIZAJE IMPLEMENTADA
              </h2>
            </div>
            <div className="profile-fields">
              <div className="profile-field">
                <div className="profile-value" style={{
                  whiteSpace: 'pre-wrap',
                  padding: '16px',
                  backgroundColor: '#dbeafe',
                  borderLeft: '4px solid #3b82f6',
                  borderRadius: '4px'
                }}>
                  {planificacionMapeada?.evaluacion_experiencia || 'No especificado'}
                </div>
              </div>
            </div>

            {/* PASO 5: ASIMILACIÓN */}
            <div className="profile-section-header" style={{marginTop: '32px'}}>
              <h2 className="profile-section-title" style={{color: '#1e40af'}}>
                PASO 5: ASIMILACIÓN DE LA EXPERIENCIA DE APRENDIZAJE
              </h2>
            </div>
            <div className="profile-fields">
              <div className="profile-field">
                <div className="profile-value" style={{
                  whiteSpace: 'pre-wrap',
                  padding: '16px',
                  backgroundColor: '#d1fae5',
                  borderLeft: '4px solid #10b981',
                  borderRadius: '4px'
                }}>
                  {planificacionMapeada?.acciones_posteriores || 'No especificado'}
                </div>
              </div>
            </div>

            {/* PASO 6: EVALUACIÓN DEL CICLO COMPLETO */}
            <div className="profile-section-header" style={{marginTop: '32px'}}>
              <h2 className="profile-section-title" style={{color: '#1e40af'}}>
                PASO 6: EVALUACIÓN DEL CICLO COMPLETO
              </h2>
            </div>
            <div className="profile-fields">
              <div className="profile-field">
                <h3 style={{
                  margin: '0 0 12px 0',
                  fontSize: '16px',
                  color: '#475569',
                  fontWeight: '600'
                }}>
                  Facilitadores u obstáculos, reflexión y proyección
                </h3>
                <div className="profile-value" style={{
                  whiteSpace: 'pre-wrap',
                  padding: '16px',
                  backgroundColor: '#fef3c7',
                  borderLeft: '4px solid #f59e0b',
                  borderRadius: '4px'
                }}>
                  {planificacionMapeada?.facilitadores_obstaculos || 'No especificado'}
                </div>
              </div>

              <div className="profile-field" style={{marginTop: '20px'}}>
                <h3 style={{
                  margin: '0 0 12px 0',
                  fontSize: '16px',
                  color: '#475569',
                  fontWeight: '600'
                }}>
                  Reflexión sobre su propia práctica
                </h3>
                <div className="profile-value" style={{
                  whiteSpace: 'pre-wrap',
                  padding: '16px',
                  backgroundColor: '#fce7f3',
                  borderLeft: '4px solid #ec4899',
                  borderRadius: '4px'
                }}>
                  {planificacionMapeada?.reflexion_practica || 'No especificado'}
                </div>
              </div>
            </div>

            {/* Botones de acción */}
            <div style={{
              marginTop: '32px',
              padding: '24px',
              backgroundColor: '#f0f9ff',
              borderRadius: '12px',
              textAlign: 'center',
              border: '2px solid #bfdbfe'
            }}>
              <h3 style={{margin: '0 0 16px 0', color: '#1e40af', fontSize: '20px'}}>
                ✅ Planificación Completada
              </h3>
              <p style={{color: '#475569', marginBottom: '20px', fontSize: '15px'}}>
                Tu diseño de experiencia de aprendizaje está listo. Puedes guardarla directamente, validarla con IA, o editarla.
              </p>

              {mensajeGuardado && (
                <div style={{
                  padding: '12px',
                  marginBottom: '16px',
                  backgroundColor: mensajeGuardado.includes('✅') ? '#d1fae5' : '#fee2e2',
                  color: mensajeGuardado.includes('✅') ? '#065f46' : '#991b1b',
                  borderRadius: '8px',
                  fontWeight: '500'
                }}>
                  {mensajeGuardado}
                </div>
              )}

              <div style={{display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap'}}>
                <button 
                  className="profile-edit-btn"
                  onClick={() => navigate('/planificacion/asistente-ia')}
                >
                  ✏️ Editar Planificación
                </button>
                <button 
                  className="profile-edit-btn editing"
                  onClick={guardarPlanificacion}
                  disabled={guardandoPlanificacion}
                  style={{
                    backgroundColor: guardandoPlanificacion ? '#94a3b8' : '#10b981',
                    cursor: guardandoPlanificacion ? 'not-allowed' : 'pointer'
                  }}
                >
                  {guardandoPlanificacion ? '⏳ Guardando...' : '💾 Guardar Planificación'}
                </button>
                <button 
                  className="profile-edit-btn"
                  onClick={() => navigate('/planificacion/verificacion')}
                  style={{backgroundColor: '#06b6d4'}}
                >
                  🤖 Validar con IA
                </button>
              </div>
            </div>

          </section>
        </div>
      </div>
    </div>
  );
};

export default VerPlanificacionAsistente;
