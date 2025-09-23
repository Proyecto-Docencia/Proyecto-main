import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/Login.css';

const Login = () => {
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
      // Simulación de autenticación (aquí irá la lógica real después)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Guardar datos del usuario (temporal)
      localStorage.setItem('userEmail', formData.email);
      localStorage.setItem('isAuthenticated', 'true');
      
      // Navegar al dashboard
      navigate('/dashboard');
    } catch (error) {
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
