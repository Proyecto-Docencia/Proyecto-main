import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/Profile.css';
import { useAuth } from '../contexts/AuthContext';
import { loadAssistedDraft, loadVerification, saveVerification, clearVerification } from '../utils/planningStorage';

// Página de verificación simulada por IA.
const VerificacionIA: React.FC = () => {
  const { user } = useAuth();
  const email = user?.email || null;
  const navigate = useNavigate();
  const [status, setStatus] = useState<'running' | 'ok' | 'fail'>('running');
  const [issues, setIssues] = useState<string[]>([]);

  useEffect(() => {
    // Intentar cargar verificación previa
    const prev = loadVerification(email);
    if (prev && prev.status !== 'pending') {
      setStatus(prev.status);
      setIssues(prev.issues || []);
      return;
    }
    // Simular análisis
    const draft = loadAssistedDraft(email); // si hubiera borrador aún
    const timer = setTimeout(() => {
      // Regla tonta: si no hay objetivos o actividades => fail
      if (!draft || !draft.objectives || !draft.activities) {
        const foundIssues = [
          !draft ? 'No se encontró la planificación en memoria.' : '',
          !draft?.objectives ? 'Faltan objetivos.' : '',
          !draft?.activities ? 'Faltan actividades.' : ''
        ].filter(Boolean);
        setIssues(foundIssues);
        setStatus('fail');
        saveVerification(email, { status: 'fail', issues: foundIssues, checkedAt: new Date().toISOString() });
      } else {
        setStatus('ok');
        saveVerification(email, { status: 'ok', checkedAt: new Date().toISOString() });
      }
    }, 1200);
    return () => clearTimeout(timer);
  }, [email]);

  const handleRetry = () => {
    clearVerification(email);
    navigate('/planificacion/nueva');
  };

  return (
    <div className="profile-container">
      <div className="profile-wrapper">
        <div className="profile-header" style={{alignItems:'center'}}>
          <div className="profile-header-main">
            <div className="profile-avatar"><span>VI</span></div>
            <div className="profile-header-info">
              <h1 className="profile-name">Verificación con IA</h1>
              <p className="profile-role">Revisión automática simulada de la planificación</p>
            </div>
          </div>
          {status === 'ok' && (
            <div className="px-3 py-2 rounded" style={{background:'#dcfce7', color:'#166534', border:'1px solid #bbf7d0'}}>Verificación correcta</div>
          )}
          {status === 'fail' && (
            <div className="px-3 py-2 rounded" style={{background:'#fee2e2', color:'#991b1b', border:'1px solid #fecaca'}}>Se encontraron problemas</div>
          )}
        </div>

        <div className="profile-content-grid">
          <section className="profile-section">
            <div className="profile-section-header">
              <h2 className="profile-section-title">Resultado</h2>
            </div>
            <div className="profile-fields">
              {status === 'running' && (
                <div className="profile-value" style={{display:'block'}}>Analizando planificación con modelos IA...</div>
              )}
              {status === 'ok' && (
                <div className="profile-value" style={{display:'block'}}>
                  La planificación cumple con los elementos mínimos (objetivos y actividades presentes). Puedes proceder a su difusión o descarga.
                  <div style={{marginTop:'12px'}}>
                    <button className="profile-edit-btn" onClick={() => navigate('/planificacion/mis-planificaciones')}>Ir a Mis planificaciones</button>
                  </div>
                </div>
              )}
              {status === 'fail' && (
                <div className="profile-value" style={{display:'block'}}>
                  <strong>Problemas detectados:</strong>
                  <ul style={{marginTop:'8px', paddingLeft:'20px'}}>
                    {issues.map((i,idx)=>(<li key={idx}>{i}</li>))}
                  </ul>
                  <div style={{marginTop:'12px', display:'flex', gap:'8px'}}>
                    <button className="profile-edit-btn editing" onClick={handleRetry}>Volver a editar</button>
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default VerificacionIA;