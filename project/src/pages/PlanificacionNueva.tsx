import React, { useMemo, useRef, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { PlanningItem, upsertPlanning } from '../utils/planningStorage';
import '../css/Profile.css';

function uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = (Math.random() * 16) | 0,
      v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

const PlanificacionNueva: React.FC = () => {
  const { user } = useAuth();
  const userEmail = user?.email || 'anon';

  const [form, setForm] = useState({
    title: '',
    subject: '',
    grade: '',
    objectives: '',
    activities: '',
    resources: '',
    evaluation: '',
  });
  const [savedMsg, setSavedMsg] = useState<string>('');
  const printRef = useRef<HTMLDivElement>(null);

  const preview = useMemo(() => ({ ...form }), [form]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSave = () => {
    const now = new Date().toISOString();
    const item: PlanningItem = {
      id: uuid(),
      title: form.title || 'Planificación sin título',
      subject: form.subject,
      grade: form.grade,
      objectives: form.objectives,
      activities: form.activities,
      resources: form.resources,
      evaluation: form.evaluation,
      createdAt: now,
      updatedAt: now,
    };
    upsertPlanning(userEmail, item);
    setSavedMsg('Planificación guardada en Mis planificaciones');
    setTimeout(() => setSavedMsg(''), 2500);
  };

  const handlePrint = () => {
    // Abrir ventana para imprimir/guardar PDF con la vista previa
    const content = printRef.current?.innerHTML || '';
    const w = window.open('', '_blank');
    if (!w) return;
    w.document.write(`<!doctype html><html><head><title>${form.title || 'Planificación'}</title>`);
    w.document.write('<meta charset="utf-8" />');
    w.document.write('<style>body{font-family: Arial, sans-serif; padding:24px;} h1{margin-bottom:8px;} h2{margin:16px 0 8px;} .box{border:1px solid #e5e7eb; border-radius:8px; padding:12px; background:#fff} .muted{color:#6b7280; font-size:12px}</style>');
    w.document.write('</head><body>');
    w.document.write(`<div>${content}</div>`);
    w.document.write('</body></html>');
    w.document.close();
    w.focus();
    w.print();
  };

  return (
    <div className="profile-container">
      <div className="profile-wrapper">
        <div className="profile-header" style={{alignItems:'center'}}>
          <div className="profile-header-main">
            <div className="profile-avatar"><span>PL</span></div>
            <div className="profile-header-info">
              <h1 className="profile-name">Nueva Planificación</h1>
              <p className="profile-role">Completa el formulario y guarda o descarga tu planificación</p>
            </div>
          </div>
          {savedMsg && (
            <div className="px-3 py-2 rounded" style={{background:'#dcfce7', color:'#166534', border:'1px solid #bbf7d0'}}>{savedMsg}</div>
          )}
        </div>

        <div className="profile-content-grid">
          <section className="profile-section">
            <div className="profile-section-header">
              <h2 className="profile-section-title">Formulario</h2>
              <div style={{display:'flex', gap:'8px'}}>
                <button className="profile-edit-btn" onClick={handleSave}>Guardar</button>
                <button className="profile-edit-btn" onClick={handlePrint}>Descargar</button>
              </div>
            </div>

            <div className="profile-fields">
              <div className="profile-field">
                <label className="profile-label">Título</label>
                <input className="profile-input" name="title" value={form.title} onChange={onChange} placeholder="Plan clase N°1 - Álgebra" />
              </div>

              <div className="profile-field-row">
                <div className="profile-field-half profile-field">
                  <label className="profile-label">Asignatura</label>
                  <input className="profile-input" name="subject" value={form.subject} onChange={onChange} placeholder="Matemática" />
                </div>
                <div className="profile-field-half profile-field">
                  <label className="profile-label">Nivel/Curso</label>
                  <input className="profile-input" name="grade" value={form.grade} onChange={onChange} placeholder="3° Medio" />
                </div>
              </div>

              <div className="profile-field">
                <label className="profile-label">Objetivos de aprendizaje</label>
                <textarea className="profile-input" name="objectives" value={form.objectives} onChange={onChange} rows={4} placeholder="Al finalizar, el estudiante será capaz de..." />
              </div>

              <div className="profile-field">
                <label className="profile-label">Actividades</label>
                <textarea className="profile-input" name="activities" value={form.activities} onChange={onChange} rows={4} placeholder="Inicio, desarrollo, cierre..." />
              </div>

              <div className="profile-field-row">
                <div className="profile-field-half profile-field">
                  <label className="profile-label">Recursos</label>
                  <textarea className="profile-input" name="resources" value={form.resources} onChange={onChange} rows={4} placeholder="Libros, PPT, enlaces, etc." />
                </div>
                <div className="profile-field-half profile-field">
                  <label className="profile-label">Evaluación</label>
                  <textarea className="profile-input" name="evaluation" value={form.evaluation} onChange={onChange} rows={4} placeholder="Rúbrica, lista de cotejo, etc." />
                </div>
              </div>
            </div>
          </section>

          <section className="profile-section">
            <div className="profile-section-header">
              <h2 className="profile-section-title">Vista previa</h2>
            </div>
            <div className="profile-fields">
              <div className="profile-value" ref={printRef} style={{display:'block'}}>
                <h1 style={{margin:'0 0 8px 0'}}>{preview.title || 'Planificación'}</h1>
                <p style={{color:'#64748b', marginBottom:'8px'}}>Autor: {user?.name || 'Docente'} • {new Date().toLocaleDateString()}</p>
                <h3 style={{margin:'12px 0 4px 0'}}>Asignatura</h3>
                <div>{preview.subject || '—'}</div>
                <h3 style={{margin:'12px 0 4px 0'}}>Nivel/Curso</h3>
                <div>{preview.grade || '—'}</div>
                <h3 style={{margin:'12px 0 4px 0'}}>Objetivos de aprendizaje</h3>
                <div style={{ whiteSpace: 'pre-wrap' }}>{preview.objectives || '—'}</div>
                <h3 style={{margin:'12px 0 4px 0'}}>Actividades</h3>
                <div style={{ whiteSpace: 'pre-wrap' }}>{preview.activities || '—'}</div>
                <h3 style={{margin:'12px 0 4px 0'}}>Recursos</h3>
                <div style={{ whiteSpace: 'pre-wrap' }}>{preview.resources || '—'}</div>
                <h3 style={{margin:'12px 0 4px 0'}}>Evaluación</h3>
                <div style={{ whiteSpace: 'pre-wrap' }}>{preview.evaluation || '—'}</div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PlanificacionNueva;
