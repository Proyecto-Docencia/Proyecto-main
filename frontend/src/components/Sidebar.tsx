import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  User, 
  LogOut, 
  ChevronDown,
  Menu,
  FileText,
  PlusCircle,
  MessageCircle,
  PlayCircle
} from 'lucide-react';
import '../css/Sidebar.css';

interface SidebarProps {
  onExpandChange: (expanded: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onExpandChange }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [isMinimized, setIsMinimized] = useState(false);
  const [openMenus, setOpenMenus] = useState<string[]>([]);

  // Notificar al Layout cuando cambia el estado minimizado/expandido
  useEffect(() => {
    onExpandChange(isMinimized);
  }, [isMinimized, onExpandChange]);

  const toggleMenu = (menuId: string) => {
    if (isMinimized) return;
    
    // Buscar el item del menú
    const menuItem = menuItems.find(item => item.id === menuId);
    
    // Si el item tiene una ruta directa (sin submenús), navegar a esa página
    if (menuItem?.path) {
      handleNavigation(menuItem.path);
      return;
    }
    
    // Si tiene submenús, manejar el desplegable
    setOpenMenus(prev => 
      prev.includes(menuId) 
        ? prev.filter(id => id !== menuId)
        : [...prev, menuId]
    );
  };

  const toggleSidebar = () => {
    setIsMinimized(!isMinimized);
    if (!isMinimized) {
      setOpenMenus([]); // Cerrar todos los menús al minimizar
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const menuItems = [
    {
      id: 'primeros-pasos',
      title: 'Primeros Pasos',
      icon: <PlayCircle className="sidebar-icon" />,
      path: '/bienvenida',
      subItems: []
    },
    {
      id: 'material',
      title: 'Material',
      icon: <FileText className="sidebar-icon" />,
      path: '/material',
      subItems: []
    },
    {
      id: 'planificacion',
      title: 'Crear Planificación',
      icon: <PlusCircle className="sidebar-icon" />,
      subItems: [
        { title: 'Planificación con Asistente IA', path: '/planificacion/asistente-ia' },
        { title: 'Ver mi planificación', path: '/planificacion/nueva' },
        { title: 'Verificación con IA', path: '/planificacion/verificacion' },
        { title: 'Mis planificaciones', path: '/planificacion/mis-planificaciones' }
      ]
    },
    {
      id: 'asistenteIA',
      title: 'Asistente IA DANIA',
      icon: <MessageCircle className="sidebar-icon" />,
      path: '/chatbot', // Ajustado: la ruta real en App.tsx es /chatbot
      subItems: []
    },
    {
      id: 'perfil',
      title: 'Mi Perfil',
      icon: <User className="sidebar-icon" />,
      path: '/perfil',
      subItems: []
    }
  ];

  return (
    <div className={`sidebar ${isMinimized ? 'minimized' : ''}`}>
      <div className="sidebar-header">
        <button 
          className="sidebar-toggle" 
          onClick={toggleSidebar}
          title={isMinimized ? 'Expandir menú' : 'Minimizar menú'}
        >
          <Menu />
        </button>
        
        <button
          className="sidebar-logo"
          onClick={() => navigate('/bienvenida')}
          title="Ir a Bienvenida"
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
        >
          <div className="sidebar-logo-icon" style={{ position: 'relative' }}>
            <img
              src="https://mi.uss.cl/_next/static/media/logoUSSWithLabel.fc3b9027.svg"
              alt="Logo USS"
              style={{
                width: '100%',
                height: 'auto',
                objectFit: 'contain',
                display: 'block'
              }}
            />
          </div>
          <div className="sidebar-logo-text">
            <h1>Portal Docente</h1>
          </div>
        </button>
      </div>

      <nav className="sidebar-nav">
        <ul className="sidebar-menu">
          {menuItems.map((item) => (
            <li key={item.id} className="sidebar-item">
              <button
                className={`sidebar-item-header ${openMenus.includes(item.id) ? 'active' : ''}`}
                onClick={() => toggleMenu(item.id)}
                data-tooltip={item.title}
              >
                <div className="sidebar-item-content">
                  {item.icon}
                  <span className="sidebar-item-text">{item.title}</span>
                </div>
                {item.subItems.length > 0 && (
                  <ChevronDown 
                    className={`sidebar-arrow ${openMenus.includes(item.id) ? 'rotated' : ''}`} 
                  />
                )}
              </button>
              
              {item.subItems.length > 0 && (
                <div className={`sidebar-submenu ${openMenus.includes(item.id) ? 'open' : ''}`}>
                  {item.subItems.map((subItem) => (
                    <button
                      key={subItem.path}
                      className="sidebar-submenu-item"
                      onClick={() => handleNavigation(subItem.path)}
                    >
                      {subItem.title}
                    </button>
                  ))}
                </div>
              )}
            </li>
          ))}
        </ul>
      </nav>

      <div className="sidebar-footer">
        <button 
          className="sidebar-logout" 
          onClick={handleLogout}
          data-tooltip="Cerrar sesión"
        >
          <LogOut className="sidebar-icon" />
          <span className="sidebar-logout-text">Cerrar sesión</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;