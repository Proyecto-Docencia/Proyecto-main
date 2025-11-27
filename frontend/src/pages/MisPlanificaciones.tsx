import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { deletePlanificacion, fetchMisPlanificaciones, generarPDFPlanificacion, fetchPlanificacionesIA, deletePlanificacionIA, generarPDFPlanificacionIA } from '../utils/api';
import '../css/Profile.css';

interface PlanItem {
  id: number;
  titulo: string;
  descripcion: string;
  asignatura: string;
  nivel_educativo: string;
  curso: string;
  unidad_tematica: string;
  duracion_horas: number;
  objetivo_general: string;
  objetivos_especificos: string[];
  competencias: string[];
  contenidos: string[];
  actividades_aprendizaje: string[];
  metodologia: string;
  recursos_materiales: string[];
  evaluacion_tipo: string;
  criterios_evaluacion: string[];
  instrumentos_evaluacion: string[];
  adaptaciones_curriculares: string;
  referencias_bibliograficas: string[];
  estado: string;
  creado_en: string;
  actualizado_en: string;
}

interface PlanItemIA {
  id: number;
  estado: string;
  datos_generales: string;
  diagnostico_estudiantes: string;
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
  ultima_validacion: string;
  creado_en: string;
  actualizado_en: string;
  tipo: 'asistente-ia';
}

const MisPlanificaciones: React.FC = () => {
  const navigate = useNavigate();
  const [list, setList] = useState<PlanItem[]>([]);
  const [listIA, setListIA] = useState<PlanItemIA[]>([]);
  const [selected, setSelected] = useState<PlanItem | null>(null);
  const [selectedIA, setSelectedIA] = useState<PlanItemIA | null>(null);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    try {
      setLoading(true);
      const data = await fetchMisPlanificaciones();
      setList(Array.isArray(data) ? data : data.results || []);
    } catch (e) {
      console.error('No se pudieron cargar planificaciones', e);
      setList([]);
    } finally {
      setLoading(false);
    }
  };

  const loadIA = async () => {
    try {
      setLoading(true);
      const data = await fetchPlanificacionesIA();
      const plans = (data.planificaciones || []).map((p: any) => ({ ...p, tipo: 'asistente-ia' as const }));
      setListIA(plans);
    } catch (e) {
      console.error('No se pudieron cargar planificaciones IA', e);
      setListIA([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    load(); 
    loadIA();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('¿Eliminar esta planificación?')) return;
    try {
      await deletePlanificacion(id);
      if (selected?.id === id) setSelected(null);
      await load();
    } catch (e) {
      console.error(e);
      alert('No se pudo eliminar. Verifica tu sesión.');
    }
  };

  const handleDeleteIA = async (id: number) => {
    if (!confirm('¿Eliminar esta planificación?')) return;
    try {
      await deletePlanificacionIA(id);
      if (selectedIA?.id === id) setSelectedIA(null);
      await loadIA();
    } catch (e) {
      console.error(e);
      alert('No se pudo eliminar. Verifica tu sesión.');
    }
  };

  const handleValidarIA = () => {
    if (selected) {
      navigate(`/planificacion/verificacion/${selected.id}`);
    }
  };

  const handleDescargarPDF = async () => {
    if (!selected) return;
    
    try {
      const blob = await generarPDFPlanificacion(selected.id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${selected.titulo}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      alert('Error al generar el PDF');
    }
  };

  const handleDescargarPDFIA = async () => {
    if (!selectedIA) return;
    
    try {
      const blob = await generarPDFPlanificacionIA(selectedIA.id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const nombre = selectedIA.datos_generales 
        ? selectedIA.datos_generales.substring(0, 50).replace(/[^\w\s]/gi, '')
        : `Planificacion_IA_${selectedIA.id}`;
      a.download = `${nombre}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      alert('Error al generar el PDF');
    }
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'borrador': return '#6b7280';
      case 'revision': return '#d97706';
      case 'validado': return '#059669';
      case 'publicado': return '#1d4ed8';
      default: return '#6b7280';
    }
  };

  const getEstadoIcon = (estado: string) => {
    switch (estado) {
      case 'borrador': return '📝';
      case 'revision': return '🔍';
      case 'validado': return '✅';
      case 'publicado': return '🚀';
      default: return '📄';
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-wrapper">
        <div className="profile-header" style={{alignItems:'center'}}>
          <div className="profile-header-main">
            <div className="profile-avatar"><span>MP</span></div>
            <div className="profile-header-info">
              <h1 className="profile-name">Mis Planificaciones</h1>
              <p className="profile-role">
                Gestiona tus planificaciones educativas - {list.length + listIA.length} planificación{(list.length + listIA.length) !== 1 ? 'es' : ''}
              </p>
            </div>
          </div>
          <button 
            className="profile-edit-btn editing" 
            onClick={() => navigate('/planificacion/nueva')}
          >
            + Nueva Planificación
          </button>
        </div>

        <div className="profile-content-grid">
          <section className="profile-section">
            <div className="profile-section-header">
              <h2 className="profile-section-title">Listado</h2>
            </div>
            <div className="profile-fields" style={{paddingTop:0}}>
              {loading && (
                <div className="profile-value" style={{display:'block', textAlign: 'center', padding: '20px'}}>
                  Cargando planificaciones...
                </div>
              )}

              {/* Todas las planificaciones juntas */}
              {!loading && list.length === 0 && listIA.length === 0 && (
                <div className="profile-value" style={{display:'block', textAlign: 'center', padding: '20px'}}>
                  <div style={{marginBottom: '16px'}}>Aún no hay planificaciones guardadas.</div>
                  <button 
                    className="profile-edit-btn" 
                    onClick={() => navigate('/planificacion/nueva')}
                  >
                    Crear mi primera planificación
                  </button>
                </div>
              )}

              {/* Planificaciones Tradicionales */}
              {!loading && list.map((p) => (
                <button
                  key={`trad-${p.id}`}
                  type="button"
                  className="profile-value"
                  style={{
                    display:'block', 
                    textAlign:'left', 
                    cursor:'pointer', 
                    borderColor: selected?.id === p.id ? '#1e3a8a' : undefined,
                    backgroundColor: selected?.id === p.id ? '#eff6ff' : undefined
                  }}
                  onClick={() => {
                    setSelected(p);
                    setSelectedIA(null);
                  }}
                >
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'start'}}>
                    <div style={{flex: 1}}>
                      <div style={{fontWeight:600, marginBottom: '4px'}}>
                        📝 {p.titulo}
                      </div>
                      <div style={{color:'#64748b', fontSize:'14px', marginBottom: '4px'}}>
                        {p.asignatura} • {p.nivel_educativo} • {p.duracion_horas}h
                      </div>
                      <div style={{color:'#64748b', fontSize:'12px'}}>
                        {new Date(p.actualizado_en).toLocaleDateString()}
                      </div>
                    </div>
                    <div style={{
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '8px',
                      color: getEstadoColor(p.estado),
                      fontSize: '12px',
                      fontWeight: 600
                    }}>
                      <span>{getEstadoIcon(p.estado)}</span>
                      <span style={{textTransform: 'capitalize'}}>{p.estado}</span>
                    </div>
                  </div>
                </button>
              ))}

              {/* Planificaciones con Asistente IA */}
              {!loading && listIA.map((p) => (
                <button
                  key={`ia-${p.id}`}
                  type="button"
                  className="profile-value"
                  style={{
                    display:'block', 
                    textAlign:'left', 
                    cursor:'pointer', 
                    borderColor: selectedIA?.id === p.id ? '#1e3a8a' : undefined,
                    backgroundColor: selectedIA?.id === p.id ? '#eff6ff' : undefined
                  }}
                  onClick={() => {
                    setSelectedIA(p);
                    setSelected(null);
                  }}
                >
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'start'}}>
                    <div style={{flex: 1}}>
                      <div style={{fontWeight:600, marginBottom: '4px'}}>
                        🤖 {p.datos_generales ? p.datos_generales.substring(0, 60) + '...' : `Planificación ${p.id}`}
                      </div>
                      <div style={{color:'#64748b', fontSize:'14px', marginBottom: '4px'}}>
                        Creada con Asistente IA
                      </div>
                      <div style={{color:'#64748b', fontSize:'12px'}}>
                        {new Date(p.actualizado_en).toLocaleDateString()}
                      </div>
                    </div>
                    <div style={{
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '8px',
                      color: getEstadoColor(p.estado),
                      fontSize: '12px',
                      fontWeight: 600
                    }}>
                      <span>{getEstadoIcon(p.estado)}</span>
                      <span style={{textTransform: 'capitalize'}}>{p.estado}</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </section>

          <section className="profile-section">
            <div className="profile-section-header">
              <h2 className="profile-section-title">
                {selected ? selected.titulo : 
                 selectedIA ? 'Planificación con IA' : 
                 'Detalle'}
              </h2>
              {selected && (
                <div style={{display:'flex', gap:'8px'}}>
                  <button className="profile-edit-btn" onClick={handleValidarIA}>
                    🤖 Validar con IA
                  </button>
                  <button className="profile-edit-btn" onClick={handleDescargarPDF}>
                    📄 Descargar PDF
                  </button>
                  <button 
                    className="profile-edit-btn editing" 
                    onClick={() => handleDelete(selected.id)}
                  >
                    🗑️ Eliminar
                  </button>
                </div>
              )}
              {selectedIA && (
                <div style={{display:'flex', gap:'8px'}}>
                  <button 
                    className="profile-edit-btn" 
                    onClick={() => navigate('/planificacion/verificacion')}
                  >
                    🤖 Validar con IA
                  </button>
                  <button className="profile-edit-btn" onClick={handleDescargarPDFIA}>
                    📄 Descargar PDF
                  </button>
                  <button 
                    className="profile-edit-btn editing" 
                    onClick={() => handleDeleteIA(selectedIA.id)}
                  >
                    🗑️ Eliminar
                  </button>
                </div>
              )}
            </div>
            
            {!selected && !selectedIA && (
              <div className="profile-value" style={{display:'block', textAlign: 'center', padding: '40px'}}>
                <div style={{marginBottom: '16px', fontSize: '48px'}}>📋</div>
                <div>Selecciona una planificación de la lista para ver sus detalles</div>
              </div>
            )}
            
            {selected && (
              <div className="profile-fields" style={{maxHeight: '600px', overflowY: 'auto'}}>
                <div className="profile-value" style={{display:'block'}}>
                  <div style={{
                    display: 'grid', 
                    gridTemplateColumns: '1fr 1fr', 
                    gap: '16px', 
                    marginBottom: '24px',
                    padding: '16px',
                    backgroundColor: '#f8fafc',
                    borderRadius: '8px'
                  }}>
                    <div>
                      <h4 style={{margin: '0 0 8px 0', color: '#374151'}}>Información General</h4>
                      <div style={{fontSize: '14px', color: '#6b7280'}}>
                        <div><strong>Asignatura:</strong> {selected.asignatura}</div>
                        <div><strong>Nivel:</strong> {selected.nivel_educativo}</div>
                        <div><strong>Curso:</strong> {selected.curso}</div>
                        <div><strong>Duración:</strong> {selected.duracion_horas} horas</div>
                      </div>
                    </div>
                    <div>
                      <h4 style={{margin: '0 0 8px 0', color: '#374151'}}>Estado y Fechas</h4>
                      <div style={{fontSize: '14px', color: '#6b7280'}}>
                        <div><strong>Estado:</strong> {getEstadoIcon(selected.estado)} {selected.estado}</div>
                        <div><strong>Creado:</strong> {new Date(selected.creado_en).toLocaleDateString()}</div>
                        <div><strong>Actualizado:</strong> {new Date(selected.actualizado_en).toLocaleDateString()}</div>
                      </div>
                    </div>
                  </div>

                  {selected.descripcion && (
                    <div style={{marginBottom: '16px'}}>
                      <h4 style={{margin: '0 0 8px 0'}}>Descripción</h4>
                      <div style={{ whiteSpace: 'pre-wrap', color: '#374151' }}>{selected.descripcion}</div>
                    </div>
                  )}

                  {selected.unidad_tematica && (
                    <div style={{marginBottom: '16px'}}>
                      <h4 style={{margin: '0 0 8px 0'}}>Unidad Temática</h4>
                      <div style={{color: '#374151'}}>{selected.unidad_tematica}</div>
                    </div>
                  )}

                  {selected.objetivo_general && (
                    <div style={{marginBottom: '16px'}}>
                      <h4 style={{margin: '0 0 8px 0'}}>Objetivo General</h4>
                      <div style={{ whiteSpace: 'pre-wrap', color: '#374151' }}>{selected.objetivo_general}</div>
                    </div>
                  )}

                  {selected.objetivos_especificos.filter(obj => obj.trim()).length > 0 && (
                    <div style={{marginBottom: '16px'}}>
                      <h4 style={{margin: '0 0 8px 0'}}>Objetivos Específicos</h4>
                      <ul style={{margin: '0', paddingLeft: '20px', color: '#374151'}}>
                        {selected.objetivos_especificos.filter(obj => obj.trim()).map((objetivo, index) => (
                          <li key={index}>{objetivo}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {selected.competencias.filter(comp => comp.trim()).length > 0 && (
                    <div style={{marginBottom: '16px'}}>
                      <h4 style={{margin: '0 0 8px 0'}}>Competencias</h4>
                      <ul style={{margin: '0', paddingLeft: '20px', color: '#374151'}}>
                        {selected.competencias.filter(comp => comp.trim()).map((competencia, index) => (
                          <li key={index}>{competencia}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {selected.contenidos.filter(cont => cont.trim()).length > 0 && (
                    <div style={{marginBottom: '16px'}}>
                      <h4 style={{margin: '0 0 8px 0'}}>Contenidos</h4>
                      <ul style={{margin: '0', paddingLeft: '20px', color: '#374151'}}>
                        {selected.contenidos.filter(cont => cont.trim()).map((contenido, index) => (
                          <li key={index}>{contenido}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {selected.actividades_aprendizaje.filter(act => act.trim()).length > 0 && (
                    <div style={{marginBottom: '16px'}}>
                      <h4 style={{margin: '0 0 8px 0'}}>Actividades de Aprendizaje</h4>
                      <div>
                        {selected.actividades_aprendizaje.filter(act => act.trim()).map((actividad, index) => (
                          <div key={index} style={{marginBottom: '8px', color: '#374151'}}>
                            <strong>{index + 1}.</strong> {actividad}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {selected.metodologia && (
                    <div style={{marginBottom: '16px'}}>
                      <h4 style={{margin: '0 0 8px 0'}}>Metodología</h4>
                      <div style={{ whiteSpace: 'pre-wrap', color: '#374151' }}>{selected.metodologia}</div>
                    </div>
                  )}

                  {selected.recursos_materiales.filter(rec => rec.trim()).length > 0 && (
                    <div style={{marginBottom: '16px'}}>
                      <h4 style={{margin: '0 0 8px 0'}}>Recursos y Materiales</h4>
                      <ul style={{margin: '0', paddingLeft: '20px', color: '#374151'}}>
                        {selected.recursos_materiales.filter(rec => rec.trim()).map((recurso, index) => (
                          <li key={index}>{recurso}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {(selected.evaluacion_tipo || selected.criterios_evaluacion.filter(crit => crit.trim()).length > 0 || selected.instrumentos_evaluacion.filter(inst => inst.trim()).length > 0) && (
                    <div style={{marginBottom: '16px'}}>
                      <h4 style={{margin: '0 0 8px 0'}}>Evaluación</h4>
                      {selected.evaluacion_tipo && (
                        <div style={{marginBottom: '8px', color: '#374151'}}>
                          <strong>Tipo:</strong> {selected.evaluacion_tipo}
                        </div>
                      )}
                      {selected.criterios_evaluacion.filter(crit => crit.trim()).length > 0 && (
                        <div style={{marginBottom: '8px'}}>
                          <strong style={{color: '#374151'}}>Criterios:</strong>
                          <ul style={{margin: '4px 0 0 0', paddingLeft: '20px', color: '#374151'}}>
                            {selected.criterios_evaluacion.filter(crit => crit.trim()).map((criterio, index) => (
                              <li key={index}>{criterio}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {selected.instrumentos_evaluacion.filter(inst => inst.trim()).length > 0 && (
                        <div>
                          <strong style={{color: '#374151'}}>Instrumentos:</strong>
                          <ul style={{margin: '4px 0 0 0', paddingLeft: '20px', color: '#374151'}}>
                            {selected.instrumentos_evaluacion.filter(inst => inst.trim()).map((instrumento, index) => (
                              <li key={index}>{instrumento}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}

                  {selected.adaptaciones_curriculares && (
                    <div style={{marginBottom: '16px'}}>
                      <h4 style={{margin: '0 0 8px 0'}}>Adaptaciones Curriculares</h4>
                      <div style={{ whiteSpace: 'pre-wrap', color: '#374151' }}>{selected.adaptaciones_curriculares}</div>
                    </div>
                  )}

                  {selected.referencias_bibliograficas.filter(ref => ref.trim()).length > 0 && (
                    <div style={{marginBottom: '16px'}}>
                      <h4 style={{margin: '0 0 8px 0'}}>Referencias Bibliográficas</h4>
                      <ol style={{margin: '0', paddingLeft: '20px', color: '#374151'}}>
                        {selected.referencias_bibliograficas.filter(ref => ref.trim()).map((referencia, index) => (
                          <li key={index}>{referencia}</li>
                        ))}
                      </ol>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* DETALLE DE PLANIFICACIONES CON ASISTENTE IA */}
            {selectedIA && (
              <div className="profile-fields" style={{maxHeight: '600px', overflowY: 'auto'}}>
                <div className="profile-value" style={{display:'block'}}>
                  <div style={{
                    padding: '16px',
                    backgroundColor: '#f8fafc',
                    borderRadius: '8px',
                    marginBottom: '16px'
                  }}>
                    <h4 style={{margin: '0 0 8px 0', color: '#374151'}}>Estado y Fechas</h4>
                    <div style={{fontSize: '14px', color: '#6b7280'}}>
                      <div><strong>Estado:</strong> {getEstadoIcon(selectedIA.estado)} {selectedIA.estado}</div>
                      <div><strong>Creado:</strong> {new Date(selectedIA.creado_en).toLocaleDateString()}</div>
                      <div><strong>Actualizado:</strong> {new Date(selectedIA.actualizado_en).toLocaleDateString()}</div>
                    </div>
                  </div>

                  {selectedIA.datos_generales && (
                    <div style={{marginBottom: '16px'}}>
                      <h4 style={{margin: '0 0 8px 0', color: '#1e40af'}}>📋 IDENTIFICACIÓN GENERAL</h4>
                      <div style={{ whiteSpace: 'pre-wrap', color: '#374151' }}>{selectedIA.datos_generales}</div>
                    </div>
                  )}

                  {selectedIA.diagnostico_estudiantes && (
                    <div style={{marginBottom: '16px'}}>
                      <h4 style={{margin: '0 0 8px 0', color: '#1e40af'}}>🎯 DIAGNÓSTICO DE ESTUDIANTES</h4>
                      <div style={{ whiteSpace: 'pre-wrap', color: '#374151' }}>{selectedIA.diagnostico_estudiantes}</div>
                    </div>
                  )}

                  {selectedIA.habilidades_propias && (
                    <div style={{marginBottom: '16px'}}>
                      <h4 style={{margin: '0 0 8px 0', color: '#1e40af'}}>👨‍🏫 HABILIDADES PROPIAS</h4>
                      <div style={{ whiteSpace: 'pre-wrap', color: '#374151' }}>{selectedIA.habilidades_propias}</div>
                    </div>
                  )}

                  {selectedIA.objetivo_actividad && (
                    <div style={{marginBottom: '16px'}}>
                      <h4 style={{margin: '0 0 8px 0', color: '#1e40af'}}>🎯 OBJETIVO DE LA ACTIVIDAD</h4>
                      <div style={{ whiteSpace: 'pre-wrap', color: '#374151' }}>{selectedIA.objetivo_actividad}</div>
                    </div>
                  )}

                  {selectedIA.contexto_temporalidad && (
                    <div style={{marginBottom: '16px'}}>
                      <h4 style={{margin: '0 0 8px 0', color: '#1e40af'}}>⏰ CONTEXTO Y TEMPORALIDAD</h4>
                      <div style={{ whiteSpace: 'pre-wrap', color: '#374151' }}>{selectedIA.contexto_temporalidad}</div>
                    </div>
                  )}

                  {selectedIA.herramientas_iagen && (
                    <div style={{marginBottom: '16px'}}>
                      <h4 style={{margin: '0 0 8px 0', color: '#1e40af'}}>🤖 HERRAMIENTAS IA GENERATIVA</h4>
                      <div style={{ whiteSpace: 'pre-wrap', color: '#374151' }}>{selectedIA.herramientas_iagen}</div>
                    </div>
                  )}

                  {selectedIA.metodologia_estrategia && (
                    <div style={{marginBottom: '16px'}}>
                      <h4 style={{margin: '0 0 8px 0', color: '#1e40af'}}>📚 METODOLOGÍA Y ESTRATEGIA</h4>
                      <div style={{ whiteSpace: 'pre-wrap', color: '#374151' }}>{selectedIA.metodologia_estrategia}</div>
                    </div>
                  )}

                  {selectedIA.indicadores_evaluacion && (
                    <div style={{marginBottom: '16px'}}>
                      <h4 style={{margin: '0 0 8px 0', color: '#1e40af'}}>✅ INDICADORES DE EVALUACIÓN</h4>
                      <div style={{ whiteSpace: 'pre-wrap', color: '#374151' }}>{selectedIA.indicadores_evaluacion}</div>
                    </div>
                  )}

                  {selectedIA.inicio_clase && (
                    <div style={{marginBottom: '16px'}}>
                      <h4 style={{margin: '0 0 8px 0', color: '#1e40af'}}>▶️ INICIO DE LA CLASE</h4>
                      <div style={{ whiteSpace: 'pre-wrap', color: '#374151' }}>{selectedIA.inicio_clase}</div>
                    </div>
                  )}

                  {selectedIA.desarrollo_clase && (
                    <div style={{marginBottom: '16px'}}>
                      <h4 style={{margin: '0 0 8px 0', color: '#1e40af'}}>⚙️ DESARROLLO DE LA CLASE</h4>
                      <div style={{ whiteSpace: 'pre-wrap', color: '#374151' }}>{selectedIA.desarrollo_clase}</div>
                    </div>
                  )}

                  {selectedIA.cierre_clase && (
                    <div style={{marginBottom: '16px'}}>
                      <h4 style={{margin: '0 0 8px 0', color: '#1e40af'}}>🏁 CIERRE DE LA CLASE</h4>
                      <div style={{ whiteSpace: 'pre-wrap', color: '#374151' }}>{selectedIA.cierre_clase}</div>
                    </div>
                  )}

                  {selectedIA.pilares_eticos && (
                    <div style={{marginBottom: '16px'}}>
                      <h4 style={{margin: '0 0 8px 0', color: '#1e40af'}}>⚖️ PILARES ÉTICOS</h4>
                      <div style={{ whiteSpace: 'pre-wrap', color: '#374151' }}>{selectedIA.pilares_eticos}</div>
                    </div>
                  )}

                  {selectedIA.registro_implementacion && (
                    <div style={{marginBottom: '16px'}}>
                      <h4 style={{margin: '0 0 8px 0', color: '#1e40af'}}>📝 REGISTRO DE IMPLEMENTACIÓN</h4>
                      <div style={{ whiteSpace: 'pre-wrap', color: '#374151' }}>{selectedIA.registro_implementacion}</div>
                    </div>
                  )}

                  {selectedIA.evaluacion_experiencia && (
                    <div style={{marginBottom: '16px'}}>
                      <h4 style={{margin: '0 0 8px 0', color: '#1e40af'}}>📊 EVALUACIÓN DE LA EXPERIENCIA</h4>
                      <div style={{ whiteSpace: 'pre-wrap', color: '#374151' }}>{selectedIA.evaluacion_experiencia}</div>
                    </div>
                  )}

                  {selectedIA.acciones_posteriores && (
                    <div style={{marginBottom: '16px'}}>
                      <h4 style={{margin: '0 0 8px 0', color: '#1e40af'}}>🔄 ACCIONES POSTERIORES</h4>
                      <div style={{ whiteSpace: 'pre-wrap', color: '#374151' }}>{selectedIA.acciones_posteriores}</div>
                    </div>
                  )}

                  {selectedIA.facilitadores_obstaculos && (
                    <div style={{marginBottom: '16px'}}>
                      <h4 style={{margin: '0 0 8px 0', color: '#1e40af'}}>⚡ FACILITADORES Y OBSTÁCULOS</h4>
                      <div style={{ whiteSpace: 'pre-wrap', color: '#374151' }}>{selectedIA.facilitadores_obstaculos}</div>
                    </div>
                  )}

                  {selectedIA.reflexion_practica && (
                    <div style={{marginBottom: '16px'}}>
                      <h4 style={{margin: '0 0 8px 0', color: '#1e40af'}}>💭 REFLEXIÓN SOBRE LA PRÁCTICA</h4>
                      <div style={{ whiteSpace: 'pre-wrap', color: '#374151' }}>{selectedIA.reflexion_practica}</div>
                    </div>
                  )}

                  {selectedIA.ultima_validacion && (
                    <div style={{marginBottom: '16px', padding: '16px', backgroundColor: '#f0f9ff', borderRadius: '8px', border: '1px solid #bfdbfe'}}>
                      <h4 style={{margin: '0 0 8px 0', color: '#1e40af'}}>🤖 ÚLTIMA VALIDACIÓN CON IA</h4>
                      <div style={{ whiteSpace: 'pre-wrap', color: '#374151', fontSize: '14px' }}>{selectedIA.ultima_validacion}</div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default MisPlanificaciones;
