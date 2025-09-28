import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../css/Login.css';

const Login = () => {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    
    // Validación de email
    const emailRegex = /^[^@\s]+@docente\.uss\.cl$/i;
    if (!formData.email.trim()) {
      newErrors.email = 'El correo electrónico es requerido';
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = 'El correo debe ser institucional y terminar en @docente.uss.cl';
    }

    // Validación de contraseña
    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    try {
      // Autenticación vía AuthContext (mock actual)
      await login(formData.email, formData.password);

      // Inicializar perfil si no existe aún
      const email = formData.email.trim();
      const nameFromEmail = email.split('@')[0].split('.').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');
      if (!localStorage.getItem('profile_email')) localStorage.setItem('profile_email', email);
      if (!localStorage.getItem('profile_name')) localStorage.setItem('profile_name', nameFromEmail || 'Usuario USS');
      if (!localStorage.getItem('profile_region')) localStorage.setItem('profile_region', 'Región Metropolitana');
      if (!localStorage.getItem('profile_comuna')) localStorage.setItem('profile_comuna', 'Providencia');
      if (!localStorage.getItem('profile_telefono')) localStorage.setItem('profile_telefono', '+56 9 8765 4321');
      if (!localStorage.getItem('profile_rut')) localStorage.setItem('profile_rut', '12.345.678-9');
      if (!localStorage.getItem('profile_direccion')) localStorage.setItem('profile_direccion', 'Av. Providencia 1234, Providencia');
      if (!localStorage.getItem('profile_sede')) localStorage.setItem('profile_sede', 'Santiago');
      if (!localStorage.getItem('profile_facultades')) localStorage.setItem('profile_facultades', JSON.stringify(['Facultad de Ingeniería']));
      if (!localStorage.getItem('profile_carreras')) localStorage.setItem('profile_carreras', JSON.stringify(['Ingeniería Civil Informática']));

  // Redirigir a página de bienvenida
  navigate('/bienvenida');
    } catch (error) {
      console.error('Login error:', error);
      setErrors({ general: 'Error al iniciar sesión. Intente nuevamente.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-bg-center">
      <div className="login-container">
        <div className="login-info">
          <div className="logo-container" style={{textAlign:'left', marginBottom:'1em'}}>
            <img src="https://universidadsansebastian.hiringroom.com/data/accounts/universidadsansebastian/microsite/5ed34d01564648ad52c7afd2d49a0909.png" alt="Logo Universidad" className="logo-uss" style={{height:'90px', display:'inline-block', verticalAlign:'middle'}} />
          </div>
          <h1>Portal Docente</h1>
          <p>Bienvenido al portal docente USS</p>
        </div>
        <div className="login-form-container">
          <form className="login-form" onSubmit={handleSubmit}>
            <h2>Iniciar Sesión</h2>
            
            {errors.general && (
              <div className="error-message general-error">{errors.general}</div>
            )}
            
            <div className="input-group">
              <label htmlFor="email">Correo Electrónico</label>
              <input 
                type="email" 
                id="email" 
                name="email"
                placeholder="nombre.apellido@docente.uss.cl" 
                value={formData.email} 
                onChange={handleInputChange}
                className={errors.email ? 'error' : ''}
                required 
              />
              <small className="help-text">Debe ser un correo @docente.uss.cl</small>
              {errors.email && <div className="error-message">{errors.email}</div>}
            </div>
            
            <div className="input-group">
              <label htmlFor="password">Contraseña</label>
              <input 
                type="password" 
                id="password" 
                name="password"
                placeholder="••••••••" 
                value={formData.password}
                onChange={handleInputChange}
                className={errors.password ? 'error' : ''}
                required 
              />
              {errors.password && <div className="error-message">{errors.password}</div>}
            </div>
            
            <button 
              type="submit" 
              className={`btn-login ${isLoading ? 'loading' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? 'Iniciando sesión...' : 'Ingresar'}
            </button>
            
            <div className="form-links">
              <div className="links-container">
                <button 
                  type="button"
                  onClick={() => navigate('/olvide-contrasena')} 
                  className="btn-secondary btn-secondary-equal"
                >
                  Recuperar contraseña
                </button>
                <button 
                  type="button"
                  onClick={() => navigate('/registro')} 
                  className="btn-secondary btn-secondary-equal"
                >
                  Registrarse
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
