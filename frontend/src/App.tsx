// React import eliminado porque no es necesario en proyectos con JSX transform moderno
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Templates from './pages/Templates';
import Materials from './pages/Materials';
import MaterialDetail from './pages/MaterialDetail';
import AICenter from './pages/AICenter';
import Profile from './pages/Profile';
import MisPlanificaciones from './pages/MisPlanificaciones';
import PlanificacionAsistenteIA from './pages/PlanificacionAsistenteIA';
import VerPlanificacionAsistente from './pages/VerPlanificacionAsistente';
import VerificacionIA from './pages/VerificacionIA';
import Welcome from './pages/Welcome';
import Chatbot from './pages/Chatbot';

import Login from './pages/Login.jsx';
import Registro from './pages/Registro.jsx';
import OlvideContrasena from './pages/OlvideContrasena.jsx';
import CorreoEnviado from './pages/CorreoEnviado.jsx';
import RegistroEnviado from './pages/RegistroEnviado.jsx';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-slate-50">
          <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/olvide-contrasena" element={<OlvideContrasena />} />
          <Route path="/correo-enviado" element={<CorreoEnviado />} />
          <Route path="/registro-enviado" element={<RegistroEnviado />} />
          <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
          <Route path="/bienvenida" element={<Layout><Welcome /></Layout>} />
          {/* Rutas antiguas, si se requieren */}
          <Route path="/home" element={<Home />} />
          <Route path="/plantillas" element={<Layout><Templates /></Layout>} />
          <Route path="/materiales" element={<Layout><Materials /></Layout>} />
          <Route path="/material" element={<Layout><Materials /></Layout>} />
          <Route path="/material/:id" element={<Layout><MaterialDetail /></Layout>} />
          <Route path="/centro-ia" element={<Layout><AICenter /></Layout>} />
          <Route path="/chatbot" element={<Layout><Chatbot /></Layout>} />
          {/* Alias para compatibilidad con enlace anterior */}
          <Route path="/asistenteIA" element={<Layout><Chatbot /></Layout>} />
          <Route path="/perfil" element={<Layout><Profile /></Layout>} />
          <Route path="/planificacion/nueva" element={<Layout><VerPlanificacionAsistente /></Layout>} />
          <Route path="/planificacion/asistente-ia" element={<Layout><PlanificacionAsistenteIA /></Layout>} />
          <Route path="/planificacion/verificacion" element={<Layout><VerificacionIA /></Layout>} />
          <Route path="/planificacion/verificacion/:planId" element={<Layout><VerificacionIA /></Layout>} />
          <Route path="/planificacion/mis-planificaciones" element={<Layout><MisPlanificaciones /></Layout>} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;