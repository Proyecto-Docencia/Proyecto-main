import React from 'react';
import { ChevronLeft } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import '../css/Header.css';

const Header: React.FC = () => {
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
    <header className="header">
      <div className="header-content">
        <div className="header-left">
          <button className="header-back-button">
            <ChevronLeft size={20} />
          </button>
          <div className="header-title-section">
            <p className="header-user-info">Campos Briceño Isidora Anasta:</p>
            <p className="header-institution">Ingeniería Civil Informática</p>
            <p className="header-institution">icamposbi@correo.uss.cl</p>
          </div>
        </div>
        
        <div className="header-right">
          <div className="header-greeting">
            <span className="header-greeting-emoji">👋</span>
            <h2 className="header-greeting-text">Hola, {getFirstName()}</h2>
          </div>
          
          <div className="header-uss-logo">
            <div style={{ 
              width: '30px', 
              height: '30px', 
              background: '#1e3a8a', 
              borderRadius: '50%', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              color: 'white', 
              fontWeight: 'bold', 
              fontSize: '12px' 
            }}>USS</div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;