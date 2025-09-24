import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { deletePlanificacion, fetchMisPlanificaciones } from '../utils/api';
import '../css/Profile.css';

const MisPlanificaciones: React.FC = () => {
  const { user } = useAuth();
  interface PlanItem {
    id: number;
    titulo: string;
    descripcion: string;
    contenido: any;
    creado_en: string; // ISO
    actualizado_en: string; // ISO
  }
  const [list, setList] = useState<PlanItem[]>([]);
  const [selected, setSelected] = useState<PlanItem | null>(null);

  const load = async () => {
    try {
      const data = await fetchMisPlanificaciones();
      setList(data.results || []);
    } catch (e) {
      console.error('No se pudieron cargar planificaciones', e);
      setList([]);
    }
  };

  useEffect(() => { load(); }, []);

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

  const handlePrint = () => {
    if (!selected) return;
    const html = `<!doctype html><html><head><meta charset="utf-8" /><title>${selected.titulo}</title>
    <style>body{font-family: Arial, sans-serif; padding:24px;} h1{margin-bottom:8px;} h2{margin:16px 0 8px;} .box{border:1px solid #e5e7eb; border-radius:8px; padding:12px; background:#fff} .muted{color:#6b7280; font-size:12px}</style>
    </head><body>
    <div class="box">
      <h1>${selected.titulo}</h1>
      <p class="muted">Autor: ${user?.name || 'Docente'} • ${new Date(selected.creado_en).toLocaleDateString()}</p>
      <h2>Descripción</h2>
      <div style="white-space: pre-wrap">${selected.descripcion || '—'}</div>
      <h2>Contenido</h2>
      <pre style="white-space: pre-wrap">${JSON.stringify(selected.contenido || {}, null, 2)}</pre>
    </div>
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
                <button
                  key={p.id}
                  type="button"
                  className="profile-value"
                  style={{display:'block', textAlign:'left', cursor:'pointer', borderColor: selected?.id === p.id ? '#1e3a8a' : undefined}}
                  onClick={() => setSelected(p)}
                >
                  <div style={{fontWeight:600}}>{p.titulo}</div>
                  <div style={{color:'#64748b', fontSize:'12px'}}>{new Date(p.creado_en).toLocaleString()}</div>
                </button>
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
                  <h1 style={{margin:'0 0 8px 0'}}>{selected.titulo}</h1>
                  <p style={{color:'#64748b', marginBottom:'8px'}}>Autor: {user?.name || 'Docente'} • {new Date(selected.creado_en).toLocaleDateString()}</p>
                  <h3 style={{margin:'12px 0 4px 0'}}>Descripción</h3>
                  <div style={{ whiteSpace: 'pre-wrap' }}>{selected.descripcion || '—'}</div>
                  <h3 style={{margin:'12px 0 4px 0'}}>Contenido</h3>
                  <pre style={{ whiteSpace: 'pre-wrap' }}>{JSON.stringify(selected.contenido || {}, null, 2)}</pre>
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
