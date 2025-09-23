import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/Login.css';

const OlvideContrasena = () => {
  const [formData, setFormData] = useState({
    email: ''
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
      // Simulación de envío de email (aquí irá la lógica real después)
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      // Guardar email para mostrar en la página de confirmación
      localStorage.setItem('recoveryEmail', formData.email);
      
      // Navegar a página de confirmación
      navigate('/correo-enviado');
    } catch (error) {
      setErrors({ general: 'Error al enviar el correo. Intente nuevamente.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-bg-center">
      <div className="login-container">
        <div className="login-info">
          <img src="https://universidadsansebastian.hiringroom.com/data/accounts/universidadsansebastian/microsite/5ed34d01564648ad52c7afd2d49a0909.png" alt="Logo Universidad" className="logo-uss" style={{height:'90px', display:'inline-block', verticalAlign:'middle'}} />
          <h1>Recuperar Contraseña</h1>
          <p>Ingrese su correo institucional para recibir instrucciones de recuperación.</p>
        </div>
      <div className="login-form-container">
        <form className="login-form" onSubmit={handleSubmit}>
          <h2>¿Olvidó su contraseña?</h2>
          <p className="form-description">
            Ingrese su correo institucional y le enviaremos instrucciones para restablecer su contraseña.
          </p>
          
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
          
          <button 
            type="submit" 
            className={`btn-login ${isLoading ? 'loading' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? 'Enviando instrucciones...' : 'Enviar instrucciones'}
          </button>
          
          <div className="form-links">
            <button 
              type="button"
              onClick={() => navigate('/')}
              className="btn-link"
            >
              Volver al inicio
            </button>
          </div>
        </form>
      </div>
    </div>
    </div>
  );
};

export default OlvideContrasena;
