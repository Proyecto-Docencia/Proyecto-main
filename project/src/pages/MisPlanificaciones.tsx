import React, { useMemo, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { loadPlannings, deletePlanning, PlanningItem } from '../utils/planningStorage';
import '../css/Profile.css';

const MisPlanificaciones: React.FC = () => {
  const { user } = useAuth();
  const userEmail = user?.email || 'anon';
  const [refresh, setRefresh] = useState(0);

  const list = useMemo(() => loadPlannings(userEmail), [userEmail, refresh]);
  const [selected, setSelected] = useState<PlanningItem | null>(null);

  const handleDelete = (id: string) => {
    if (!confirm('¿Eliminar esta planificación?')) return;
    deletePlanning(userEmail, id);
    setSelected((s) => (s?.id === id ? null : s));
    setRefresh((n) => n + 1);
  };

  const handlePrint = () => {
    if (!selected) return;
    const w = window.open('', '_blank');
    if (!w) return;
    w.document.write(`<!doctype html><html><head><title>${selected.title}</title>`);
    w.document.write('<meta charset="utf-8" />');
    w.document.write('<style>body{font-family: Arial, sans-serif; padding:24px;} h1{margin-bottom:8px;} h2{margin:16px 0 8px;} .box{border:1px solid #e5e7eb; border-radius:8px; padding:12px; background:#fff} .muted{color:#6b7280; font-size:12px}</style>');
    w.document.write('</head><body>');
    w.document.write(`<div class="box">
      <h1>${selected.title}</h1>
      <p class="muted">Autor: ${user?.name || 'Docente'} • ${new Date(selected.createdAt).toLocaleDateString()}</p>
      <h2>Asignatura</h2>
      <div>${selected.subject || '—'}</div>
      <h2>Nivel/Curso</h2>
      <div>${selected.grade || '—'}</div>
      <h2>Objetivos de aprendizaje</h2>
      <div style="white-space: pre-wrap">${selected.objectives || '—'}</div>
      <h2>Actividades</h2>
      <div style="white-space: pre-wrap">${selected.activities || '—'}</div>
      <h2>Recursos</h2>
      <div style="white-space: pre-wrap">${selected.resources || '—'}</div>
      <h2>Evaluación</h2>
      <div style="white-space: pre-wrap">${selected.evaluation || '—'}</div>
    </div>`);
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
            <div className="profile-avatar"><span>MP</span></div>
            <div className="profile-header-info">
              <h1 className="profile-name">Mis Planificaciones</h1>
              <p className="profile-role">Revisa, descarga o elimina tus planificaciones guardadas</p>
            </div>
          </div>
        </div>

        <div className="profile-content-grid">
          <section className="profile-section">
            <div className="profile-section-header">
              <h2 className="profile-section-title">Listado</h2>
            </div>
            <div className="profile-fields" style={{paddingTop:0}}>
              {list.length === 0 && (
                <div className="profile-value" style={{display:'block'}}>Aún no hay planificaciones guardadas.</div>
              )}
              {list.map((p) => (
                <div 
                  key={p.id} 
                  className="profile-value" 
                  style={{display:'block', cursor:'pointer', borderColor: selected?.id === p.id ? '#1e3a8a' : undefined}}
                  onClick={() => setSelected(p)}
                >
                  <div style={{fontWeight:600}}>{p.title}</div>
                  <div style={{color:'#64748b', fontSize:'12px'}}>{new Date(p.createdAt).toLocaleString()} • {p.subject} • {p.grade}</div>
                </div>
              ))}
            </div>
          </section>

          <section className="profile-section">
            <div className="profile-section-header">
              <h2 className="profile-section-title">Detalle</h2>
              <div style={{display:'flex', gap:'8px'}}>
                <button className="profile-edit-btn" onClick={handlePrint} disabled={!selected}>Descargar</button>
                <button className="profile-edit-btn editing" onClick={() => selected && handleDelete(selected.id)} disabled={!selected}>Eliminar</button>
              </div>
            </div>
            {!selected ? (
              <div className="profile-value" style={{display:'block'}}>Selecciona una planificación de la lista para verla.</div>
            ) : (
              <div className="profile-fields">
                <div className="profile-value" style={{display:'block'}}>
                  <h1 style={{margin:'0 0 8px 0'}}>{selected.title}</h1>
                  <p style={{color:'#64748b', marginBottom:'8px'}}>Autor: {user?.name || 'Docente'} • {new Date(selected.createdAt).toLocaleDateString()}</p>
                  <h3 style={{margin:'12px 0 4px 0'}}>Asignatura</h3>
                  <div>{selected.subject || '—'}</div>
                  <h3 style={{margin:'12px 0 4px 0'}}>Nivel/Curso</h3>
                  <div>{selected.grade || '—'}</div>
                  <h3 style={{margin:'12px 0 4px 0'}}>Objetivos de aprendizaje</h3>
                  <div style={{ whiteSpace: 'pre-wrap' }}>{selected.objectives || '—'}</div>
                  <h3 style={{margin:'12px 0 4px 0'}}>Actividades</h3>
                  <div style={{ whiteSpace: 'pre-wrap' }}>{selected.activities || '—'}</div>
                  <h3 style={{margin:'12px 0 4px 0'}}>Recursos</h3>
                  <div style={{ whiteSpace: 'pre-wrap' }}>{selected.resources || '—'}</div>
                  <h3 style={{margin:'12px 0 4px 0'}}>Evaluación</h3>
                  <div style={{ whiteSpace: 'pre-wrap' }}>{selected.evaluation || '—'}</div>
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
