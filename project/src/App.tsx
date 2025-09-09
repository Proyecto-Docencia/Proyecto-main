import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Templates from './pages/Templates';
import Materials from './pages/Materials';
import AICenter from './pages/AICenter';
import Profile from './pages/Profile';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-slate-50">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
            <Route path="/plantillas" element={<Layout><Templates /></Layout>} />
            <Route path="/materiales" element={<Layout><Materials /></Layout>} />
            <Route path="/centro-ia" element={<Layout><AICenter /></Layout>} />
            <Route path="/perfil" element={<Layout><Profile /></Layout>} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;