import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { crearPlanificacion } from '../utils/api';
import '../css/Profile.css';
import { loadAssistedDraft, clearAssistedDraft } from '../utils/planningStorage';
import { useNavigate } from 'react-router-dom';

interface PlanningForm {
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
}

const PlanificacionNueva: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const email = user?.email || null;

  const [form, setForm] = useState<PlanningForm>({
    titulo: '',
    descripcion: '',
    asignatura: '',
    nivel_educativo: '',
    curso: '',
    unidad_tematica: '',
    duracion_horas: 1,
    objetivo_general: '',
    objetivos_especificos: [''],
    competencias: [''],
    contenidos: [''],
    actividades_aprendizaje: [''],
    metodologia: '',
    recursos_materiales: [''],
    evaluacion_tipo: '',
    criterios_evaluacion: [''],
    instrumentos_evaluacion: [''],
    adaptaciones_curriculares: '',
    referencias_bibliograficas: ['']
  });

  const [savedMsg, setSavedMsg] = useState<string>('');
  const printRef = useRef<HTMLDivElement>(null);

  const preview = useMemo(() => ({ ...form }), [form]);

  // Precargar borrador asistido si existe (legacy compatibility)
  useEffect(() => {
    const draft = loadAssistedDraft(email);
    if (draft) {
      setForm(prev => ({
        ...prev,
        titulo: draft.title || '',
        asignatura: draft.subject || '',
        curso: draft.grade || '',
        objetivo_general: draft.objectives || '',
        actividades_aprendizaje: draft.activities ? [draft.activities] : [''],
        recursos_materiales: draft.resources ? [draft.resources] : [''],
        evaluacion_tipo: draft.evaluation || ''
      }));
      clearAssistedDraft(email);
    }
  }, [email]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'duracion_horas') {
      setForm((f) => ({ ...f, [name]: parseInt(value) || 1 }));
    } else {
      setForm((f) => ({ ...f, [name]: value }));
    }
  };

  const onArrayChange = (field: keyof PlanningForm, index: number, value: string) => {
    setForm(prev => ({
      ...prev,
      [field]: (prev[field] as string[]).map((item, i) => i === index ? value : item)
    }));
  };

  const addArrayItem = (field: keyof PlanningForm) => {
    setForm(prev => ({
      ...prev,
      [field]: [...(prev[field] as string[]), '']
    }));
  };

  const removeArrayItem = (field: keyof PlanningForm, index: number) => {
    setForm(prev => ({
      ...prev,
      [field]: (prev[field] as string[]).filter((_, i) => i !== index)
    }));
  };

  const handleSave = async () => {
    try {
      // Filtrar campos vacíos de arrays
      const payload = {
        ...form,
        objetivos_especificos: form.objetivos_especificos.filter(obj => obj.trim() !== ''),
        competencias: form.competencias.filter(comp => comp.trim() !== ''),
        contenidos: form.contenidos.filter(cont => cont.trim() !== ''),
        actividades_aprendizaje: form.actividades_aprendizaje.filter(act => act.trim() !== ''),
        recursos_materiales: form.recursos_materiales.filter(rec => rec.trim() !== ''),
        criterios_evaluacion: form.criterios_evaluacion.filter(crit => crit.trim() !== ''),
        instrumentos_evaluacion: form.instrumentos_evaluacion.filter(inst => inst.trim() !== ''),
        referencias_bibliograficas: form.referencias_bibliograficas.filter(ref => ref.trim() !== '')
      };
      
      await crearPlanificacion(payload);
      setSavedMsg('Planificación guardada en Mis planificaciones');
      setTimeout(() => setSavedMsg(''), 2500);
    } catch (e) {
      console.error('No se pudo guardar', e);
      alert('No se pudo guardar la planificación. Verifica tu sesión.');
    }
  };

  const handlePrint = () => {
    // Abrir ventana para imprimir/guardar PDF con la vista previa
    const content = printRef.current?.innerHTML || '';
    const html = `<!doctype html><html><head><meta charset="utf-8" /><title>${form.titulo || 'Planificación'}</title>
    <style>body{font-family: Arial, sans-serif; padding:24px;} h1{margin-bottom:8px;} h2{margin:16px 0 8px;} .box{border:1px solid #e5e7eb; border-radius:8px; padding:12px; background:#fff} .muted{color:#6b7280; font-size:12px}</style>
    </head><body>
    <div>${content}</div>
    <script>window.onload=function(){window.print();}</script>
    </body></html>`;
    const dataUrl = 'data:text/html;charset=utf-8,' + encodeURIComponent(html);
    window.open(dataUrl, '_blank');
  };

  return (
    <div className="profile-container">
      <div className="profile-wrapper">
        <div className="profile-header" style={{alignItems:'center'}}>
          <div className="profile-header-main">
            <div className="profile-avatar"><span>PL</span></div>
            <div className="profile-header-info">
              <h1 className="profile-name">Nueva Planificación</h1>
              <p className="profile-role">Completa el formulario detallado para crear tu planificación educativa</p>
            </div>
          </div>
          {savedMsg && (
            <div className="px-3 py-2 rounded" style={{background:'#dcfce7', color:'#166534', border:'1px solid #bbf7d0'}}>{savedMsg}</div>
          )}
        </div>

        <div className="profile-content-grid">
          <section className="profile-section">
            <div className="profile-section-header">
              <h2 className="profile-section-title">Información General</h2>
              <div style={{display:'flex', gap:'8px'}}>
                <button className="profile-edit-btn" onClick={handleSave}>Guardar</button>
                <button className="profile-edit-btn" onClick={handlePrint}>Vista previa</button>
                <button className="profile-edit-btn editing" onClick={() => navigate('/planificacion/verificacion')}>Verificación IA</button>
              </div>
            </div>

            <div className="profile-fields">
              <div className="profile-field">
                <label className="profile-label" htmlFor="titulo">Título de la planificación *</label>
                <input 
                  id="titulo" 
                  className="profile-input" 
                  name="titulo" 
                  value={form.titulo} 
                  onChange={onChange} 
                  placeholder="Plan clase N°1 - Álgebra Básica" 
                />
              </div>

              <div className="profile-field">
                <label className="profile-label" htmlFor="descripcion">Descripción</label>
                <textarea 
                  id="descripcion" 
                  className="profile-input" 
                  name="descripcion" 
                  value={form.descripcion} 
                  onChange={onChange} 
                  rows={3} 
                  placeholder="Descripción general de la planificación..." 
                />
              </div>

              <div className="profile-field-row">
                <div className="profile-field-half profile-field">
                  <label className="profile-label" htmlFor="asignatura">Asignatura *</label>
                  <input 
                    id="asignatura" 
                    className="profile-input" 
                    name="asignatura" 
                    value={form.asignatura} 
                    onChange={onChange} 
                    placeholder="Matemática" 
                  />
                </div>
                <div className="profile-field-half profile-field">
                  <label className="profile-label" htmlFor="nivel_educativo">Nivel Educativo</label>
                  <select 
                    id="nivel_educativo" 
                    className="profile-input" 
                    name="nivel_educativo" 
                    value={form.nivel_educativo} 
                    onChange={onChange}
                  >
                    <option value="">Selecciona un nivel</option>
                    <option value="Educación Parvularia">Educación Parvularia</option>
                    <option value="Educación Básica">Educación Básica</option>
                    <option value="Educación Media">Educación Media</option>
                    <option value="Educación Superior">Educación Superior</option>
                  </select>
                </div>
              </div>

              <div className="profile-field-row">
                <div className="profile-field-half profile-field">
                  <label className="profile-label" htmlFor="curso">Curso</label>
                  <input 
                    id="curso" 
                    className="profile-input" 
                    name="curso" 
                    value={form.curso} 
                    onChange={onChange} 
                    placeholder="3° Medio A" 
                  />
                </div>
                <div className="profile-field-half profile-field">
                  <label className="profile-label" htmlFor="duracion_horas">Duración (horas)</label>
                  <input 
                    id="duracion_horas" 
                    className="profile-input" 
                    name="duracion_horas" 
                    type="number" 
                    min="1" 
                    value={form.duracion_horas} 
                    onChange={onChange} 
                  />
                </div>
              </div>

              <div className="profile-field">
                <label className="profile-label" htmlFor="unidad_tematica">Unidad Temática</label>
                <input 
                  id="unidad_tematica" 
                  className="profile-input" 
                  name="unidad_tematica" 
                  value={form.unidad_tematica} 
                  onChange={onChange} 
                  placeholder="Unidad 2: Álgebra y funciones" 
                />
              </div>
            </div>
          </section>

          <section className="profile-section">
            <div className="profile-section-header">
              <h2 className="profile-section-title">Objetivos y Competencias</h2>
            </div>
            
            <div className="profile-fields">
              <div className="profile-field">
                <label className="profile-label" htmlFor="objetivo_general">Objetivo General</label>
                <textarea 
                  id="objetivo_general" 
                  className="profile-input" 
                  name="objetivo_general" 
                  value={form.objetivo_general} 
                  onChange={onChange} 
                  rows={3} 
                  placeholder="Al finalizar la unidad, el estudiante será capaz de..." 
                />
              </div>

              <div className="profile-field">
                <label className="profile-label">Objetivos Específicos</label>
                {form.objetivos_especificos.map((objetivo, index) => (
                  <div key={index} style={{display:'flex', gap:'8px', marginBottom:'8px'}}>
                    <textarea 
                      className="profile-input" 
                      value={objetivo} 
                      onChange={(e) => onArrayChange('objetivos_especificos', index, e.target.value)}
                      rows={2} 
                      placeholder={`Objetivo específico ${index + 1}`}
                      style={{flex: 1}}
                    />
                    {form.objetivos_especificos.length > 1 && (
                      <button 
                        type="button" 
                        onClick={() => removeArrayItem('objetivos_especificos', index)}
                        className="profile-edit-btn"
                        style={{alignSelf: 'flex-start', backgroundColor: '#ef4444'}}
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
                <button 
                  type="button" 
                  onClick={() => addArrayItem('objetivos_especificos')}
                  className="profile-edit-btn"
                  style={{marginTop: '8px'}}
                >
                  + Agregar objetivo
                </button>
              </div>

              <div className="profile-field">
                <label className="profile-label">Competencias</label>
                {form.competencias.map((competencia, index) => (
                  <div key={index} style={{display:'flex', gap:'8px', marginBottom:'8px'}}>
                    <input 
                      className="profile-input" 
                      value={competencia} 
                      onChange={(e) => onArrayChange('competencias', index, e.target.value)}
                      placeholder={`Competencia ${index + 1}`}
                      style={{flex: 1}}
                    />
                    {form.competencias.length > 1 && (
                      <button 
                        type="button" 
                        onClick={() => removeArrayItem('competencias', index)}
                        className="profile-edit-btn"
                        style={{alignSelf: 'flex-start', backgroundColor: '#ef4444'}}
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
                <button 
                  type="button" 
                  onClick={() => addArrayItem('competencias')}
                  className="profile-edit-btn"
                  style={{marginTop: '8px'}}
                >
                  + Agregar competencia
                </button>
              </div>
            </div>
          </section>

          <section className="profile-section">
            <div className="profile-section-header">
              <h2 className="profile-section-title">Contenidos y Metodología</h2>
            </div>
            
            <div className="profile-fields">
              <div className="profile-field">
                <label className="profile-label">Contenidos</label>
                {form.contenidos.map((contenido, index) => (
                  <div key={index} style={{display:'flex', gap:'8px', marginBottom:'8px'}}>
                    <input 
                      className="profile-input" 
                      value={contenido} 
                      onChange={(e) => onArrayChange('contenidos', index, e.target.value)}
                      placeholder={`Contenido ${index + 1}`}
                      style={{flex: 1}}
                    />
                    {form.contenidos.length > 1 && (
                      <button 
                        type="button" 
                        onClick={() => removeArrayItem('contenidos', index)}
                        className="profile-edit-btn"
                        style={{alignSelf: 'flex-start', backgroundColor: '#ef4444'}}
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
                <button 
                  type="button" 
                  onClick={() => addArrayItem('contenidos')}
                  className="profile-edit-btn"
                  style={{marginTop: '8px'}}
                >
                  + Agregar contenido
                </button>
              </div>

              <div className="profile-field">
                <label className="profile-label">Actividades de Aprendizaje</label>
                {form.actividades_aprendizaje.map((actividad, index) => (
                  <div key={index} style={{display:'flex', gap:'8px', marginBottom:'8px'}}>
                    <textarea 
                      className="profile-input" 
                      value={actividad} 
                      onChange={(e) => onArrayChange('actividades_aprendizaje', index, e.target.value)}
                      rows={2} 
                      placeholder={`Actividad ${index + 1}`}
                      style={{flex: 1}}
                    />
                    {form.actividades_aprendizaje.length > 1 && (
                      <button 
                        type="button" 
                        onClick={() => removeArrayItem('actividades_aprendizaje', index)}
                        className="profile-edit-btn"
                        style={{alignSelf: 'flex-start', backgroundColor: '#ef4444'}}
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
                <button 
                  type="button" 
                  onClick={() => addArrayItem('actividades_aprendizaje')}
                  className="profile-edit-btn"
                  style={{marginTop: '8px'}}
                >
                  + Agregar actividad
                </button>
              </div>

              <div className="profile-field">
                <label className="profile-label" htmlFor="metodologia">Metodología</label>
                <textarea 
                  id="metodologia" 
                  className="profile-input" 
                  name="metodologia" 
                  value={form.metodologia} 
                  onChange={onChange} 
                  rows={4} 
                  placeholder="Describe la metodología a utilizar..." 
                />
              </div>
            </div>
          </section>

          <section className="profile-section">
            <div className="profile-section-header">
              <h2 className="profile-section-title">Recursos y Evaluación</h2>
            </div>
            
            <div className="profile-fields">
              <div className="profile-field">
                <label className="profile-label">Recursos y Materiales</label>
                {form.recursos_materiales.map((recurso, index) => (
                  <div key={index} style={{display:'flex', gap:'8px', marginBottom:'8px'}}>
                    <input 
                      className="profile-input" 
                      value={recurso} 
                      onChange={(e) => onArrayChange('recursos_materiales', index, e.target.value)}
                      placeholder={`Recurso ${index + 1}`}
                      style={{flex: 1}}
                    />
                    {form.recursos_materiales.length > 1 && (
                      <button 
                        type="button" 
                        onClick={() => removeArrayItem('recursos_materiales', index)}
                        className="profile-edit-btn"
                        style={{alignSelf: 'flex-start', backgroundColor: '#ef4444'}}
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
                <button 
                  type="button" 
                  onClick={() => addArrayItem('recursos_materiales')}
                  className="profile-edit-btn"
                  style={{marginTop: '8px'}}
                >
                  + Agregar recurso
                </button>
              </div>

              <div className="profile-field">
                <label className="profile-label" htmlFor="evaluacion_tipo">Tipo de Evaluación</label>
                <select 
                  id="evaluacion_tipo" 
                  className="profile-input" 
                  name="evaluacion_tipo" 
                  value={form.evaluacion_tipo} 
                  onChange={onChange}
                >
                  <option value="">Selecciona tipo de evaluación</option>
                  <option value="Formativa">Formativa</option>
                  <option value="Sumativa">Sumativa</option>
                  <option value="Diagnóstica">Diagnóstica</option>
                  <option value="Autoevaluación">Autoevaluación</option>
                  <option value="Coevaluación">Coevaluación</option>
                </select>
              </div>

              <div className="profile-field-row">
                <div className="profile-field-half profile-field">
                  <label className="profile-label">Criterios de Evaluación</label>
                  {form.criterios_evaluacion.map((criterio, index) => (
                    <div key={index} style={{display:'flex', gap:'8px', marginBottom:'8px'}}>
                      <input 
                        className="profile-input" 
                        value={criterio} 
                        onChange={(e) => onArrayChange('criterios_evaluacion', index, e.target.value)}
                        placeholder={`Criterio ${index + 1}`}
                        style={{flex: 1}}
                      />
                      {form.criterios_evaluacion.length > 1 && (
                        <button 
                          type="button" 
                          onClick={() => removeArrayItem('criterios_evaluacion', index)}
                          className="profile-edit-btn"
                          style={{alignSelf: 'flex-start', backgroundColor: '#ef4444'}}
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ))}
                  <button 
                    type="button" 
                    onClick={() => addArrayItem('criterios_evaluacion')}
                    className="profile-edit-btn"
                    style={{marginTop: '8px'}}
                  >
                    + Agregar criterio
                  </button>
                </div>

                <div className="profile-field-half profile-field">
                  <label className="profile-label">Instrumentos de Evaluación</label>
                  {form.instrumentos_evaluacion.map((instrumento, index) => (
                    <div key={index} style={{display:'flex', gap:'8px', marginBottom:'8px'}}>
                      <input 
                        className="profile-input" 
                        value={instrumento} 
                        onChange={(e) => onArrayChange('instrumentos_evaluacion', index, e.target.value)}
                        placeholder={`Instrumento ${index + 1}`}
                        style={{flex: 1}}
                      />
                      {form.instrumentos_evaluacion.length > 1 && (
                        <button 
                          type="button" 
                          onClick={() => removeArrayItem('instrumentos_evaluacion', index)}
                          className="profile-edit-btn"
                          style={{alignSelf: 'flex-start', backgroundColor: '#ef4444'}}
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ))}
                  <button 
                    type="button" 
                    onClick={() => addArrayItem('instrumentos_evaluacion')}
                    className="profile-edit-btn"
                    style={{marginTop: '8px'}}
                  >
                    + Agregar instrumento
                  </button>
                </div>
              </div>

              <div className="profile-field">
                <label className="profile-label" htmlFor="adaptaciones_curriculares">Adaptaciones Curriculares</label>
                <textarea 
                  id="adaptaciones_curriculares" 
                  className="profile-input" 
                  name="adaptaciones_curriculares" 
                  value={form.adaptaciones_curriculares} 
                  onChange={onChange} 
                  rows={3} 
                  placeholder="Describe las adaptaciones necesarias para estudiantes con NEE..." 
                />
              </div>

              <div className="profile-field">
                <label className="profile-label">Referencias Bibliográficas</label>
                {form.referencias_bibliograficas.map((referencia, index) => (
                  <div key={index} style={{display:'flex', gap:'8px', marginBottom:'8px'}}>
                    <input 
                      className="profile-input" 
                      value={referencia} 
                      onChange={(e) => onArrayChange('referencias_bibliograficas', index, e.target.value)}
                      placeholder={`Referencia ${index + 1}`}
                      style={{flex: 1}}
                    />
                    {form.referencias_bibliograficas.length > 1 && (
                      <button 
                        type="button" 
                        onClick={() => removeArrayItem('referencias_bibliograficas', index)}
                        className="profile-edit-btn"
                        style={{alignSelf: 'flex-start', backgroundColor: '#ef4444'}}
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
                <button 
                  type="button" 
                  onClick={() => addArrayItem('referencias_bibliograficas')}
                  className="profile-edit-btn"
                  style={{marginTop: '8px'}}
                >
                  + Agregar referencia
                </button>
              </div>
            </div>
          </section>

          <section className="profile-section">
            <div className="profile-section-header">
              <h2 className="profile-section-title">Vista previa</h2>
            </div>
            <div className="profile-fields">
              <div className="profile-value" ref={printRef} style={{display:'block'}}>
                <h1 style={{margin:'0 0 8px 0'}}>{preview.titulo || 'Planificación sin título'}</h1>
                <p style={{color:'#64748b', marginBottom:'16px'}}>
                  Autor: {user?.name || 'Docente'} • {new Date().toLocaleDateString()} • {preview.duracion_horas}h
                </p>
                
                {preview.descripcion && (
                  <>
                    <h3 style={{margin:'12px 0 4px 0'}}>Descripción</h3>
                    <div style={{ whiteSpace: 'pre-wrap', marginBottom: '12px' }}>{preview.descripcion}</div>
                  </>
                )}

                <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px'}}>
                  <div>
                    <h3 style={{margin:'0 0 4px 0'}}>Asignatura</h3>
                    <div>{preview.asignatura || '—'}</div>
                  </div>
                  <div>
                    <h3 style={{margin:'0 0 4px 0'}}>Nivel/Curso</h3>
                    <div>{preview.nivel_educativo} - {preview.curso || '—'}</div>
                  </div>
                </div>

                {preview.unidad_tematica && (
                  <>
                    <h3 style={{margin:'12px 0 4px 0'}}>Unidad Temática</h3>
                    <div style={{marginBottom: '12px'}}>{preview.unidad_tematica}</div>
                  </>
                )}

                {preview.objetivo_general && (
                  <>
                    <h3 style={{margin:'12px 0 4px 0'}}>Objetivo General</h3>
                    <div style={{ whiteSpace: 'pre-wrap', marginBottom: '12px' }}>{preview.objetivo_general}</div>
                  </>
                )}

                {preview.objetivos_especificos.filter(obj => obj.trim()).length > 0 && (
                  <>
                    <h3 style={{margin:'12px 0 4px 0'}}>Objetivos Específicos</h3>
                    <ul style={{marginBottom: '12px'}}>
                      {preview.objetivos_especificos.filter(obj => obj.trim()).map((objetivo, index) => (
                        <li key={index}>{objetivo}</li>
                      ))}
                    </ul>
                  </>
                )}

                {preview.competencias.filter(comp => comp.trim()).length > 0 && (
                  <>
                    <h3 style={{margin:'12px 0 4px 0'}}>Competencias</h3>
                    <ul style={{marginBottom: '12px'}}>
                      {preview.competencias.filter(comp => comp.trim()).map((competencia, index) => (
                        <li key={index}>{competencia}</li>
                      ))}
                    </ul>
                  </>
                )}

                {preview.contenidos.filter(cont => cont.trim()).length > 0 && (
                  <>
                    <h3 style={{margin:'12px 0 4px 0'}}>Contenidos</h3>
                    <ul style={{marginBottom: '12px'}}>
                      {preview.contenidos.filter(cont => cont.trim()).map((contenido, index) => (
                        <li key={index}>{contenido}</li>
                      ))}
                    </ul>
                  </>
                )}

                {preview.actividades_aprendizaje.filter(act => act.trim()).length > 0 && (
                  <>
                    <h3 style={{margin:'12px 0 4px 0'}}>Actividades de Aprendizaje</h3>
                    <div style={{marginBottom: '12px'}}>
                      {preview.actividades_aprendizaje.filter(act => act.trim()).map((actividad, index) => (
                        <div key={index} style={{marginBottom: '8px', whiteSpace: 'pre-wrap'}}>
                          <strong>{index + 1}.</strong> {actividad}
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {preview.metodologia && (
                  <>
                    <h3 style={{margin:'12px 0 4px 0'}}>Metodología</h3>
                    <div style={{ whiteSpace: 'pre-wrap', marginBottom: '12px' }}>{preview.metodologia}</div>
                  </>
                )}

                {preview.recursos_materiales.filter(rec => rec.trim()).length > 0 && (
                  <>
                    <h3 style={{margin:'12px 0 4px 0'}}>Recursos y Materiales</h3>
                    <ul style={{marginBottom: '12px'}}>
                      {preview.recursos_materiales.filter(rec => rec.trim()).map((recurso, index) => (
                        <li key={index}>{recurso}</li>
                      ))}
                    </ul>
                  </>
                )}

                {preview.evaluacion_tipo && (
                  <>
                    <h3 style={{margin:'12px 0 4px 0'}}>Evaluación</h3>
                    <div style={{marginBottom: '8px'}}><strong>Tipo:</strong> {preview.evaluacion_tipo}</div>
                  </>
                )}

                {preview.criterios_evaluacion.filter(crit => crit.trim()).length > 0 && (
                  <>
                    <div style={{marginBottom: '8px'}}><strong>Criterios:</strong></div>
                    <ul style={{marginBottom: '12px'}}>
                      {preview.criterios_evaluacion.filter(crit => crit.trim()).map((criterio, index) => (
                        <li key={index}>{criterio}</li>
                      ))}
                    </ul>
                  </>
                )}

                {preview.instrumentos_evaluacion.filter(inst => inst.trim()).length > 0 && (
                  <>
                    <div style={{marginBottom: '8px'}}><strong>Instrumentos:</strong></div>
                    <ul style={{marginBottom: '12px'}}>
                      {preview.instrumentos_evaluacion.filter(inst => inst.trim()).map((instrumento, index) => (
                        <li key={index}>{instrumento}</li>
                      ))}
                    </ul>
                  </>
                )}

                {preview.adaptaciones_curriculares && (
                  <>
                    <h3 style={{margin:'12px 0 4px 0'}}>Adaptaciones Curriculares</h3>
                    <div style={{ whiteSpace: 'pre-wrap', marginBottom: '12px' }}>{preview.adaptaciones_curriculares}</div>
                  </>
                )}

                {preview.referencias_bibliograficas.filter(ref => ref.trim()).length > 0 && (
                  <>
                    <h3 style={{margin:'12px 0 4px 0'}}>Referencias Bibliográficas</h3>
                    <ol style={{marginBottom: '12px'}}>
                      {preview.referencias_bibliograficas.filter(ref => ref.trim()).map((referencia, index) => (
                        <li key={index}>{referencia}</li>
                      ))}
                    </ol>
                  </>
                )}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PlanificacionNueva;
