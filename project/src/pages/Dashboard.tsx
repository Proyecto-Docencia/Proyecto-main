import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import '../css/Dashboard.css';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  const getUserName = () => {
    if (user?.name) return user.name;
    const storageName = localStorage.getItem('userNombre');
    const storageEmail = localStorage.getItem('userEmail');
    return storageName || storageEmail?.split('@')[0] || 'Campos';
  };

  const getFirstName = () => {
    const fullName = getUserName();
    return fullName.split(' ')[0] || 'Campos';
  };

  return (
    <div className="dashboard-content">
      <div className="welcome-section">
        <h1 className="welcome-title">Dashboard Principal</h1>
        <p className="welcome-subtitle">
          Bienvenido al Portal Docente USS, {getFirstName()}
        </p>
      </div>
      
      <div className="content-area">
        <p>Esta es el área principal del dashboard. Aquí puedes agregar el contenido que necesites.</p>
      </div>
    </div>
  );
};

export default Dashboard;