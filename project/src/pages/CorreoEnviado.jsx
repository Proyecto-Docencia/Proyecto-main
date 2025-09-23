import React from 'react';
import '../css/Login.css';

const CorreoEnviado = () => {
  return (
    <div className="login-container">
      <div className="login-info">
        <img src="https://universidadsansebastian.hiringroom.com/data/accounts/universidadsansebastian/microsite/5ed34d01564648ad52c7afd2d49a0909.png" alt="Logo Universidad" className="logo-uss" style={{height:'90px', display:'inline-block', verticalAlign:'middle'}} />
        <h1>Recuperar Contraseña</h1>
        <p>Revisa tu correo institucional.</p>
      </div>
      <div className="login-form-container">
        <div className="login-form" style={{textAlign:'center'}}>
          <i className="fas fa-envelope-open-text fa-3x" style={{color:'#09437c', marginBottom:'18px'}}></i>
          <h2>Correo enviado</h2>
          <p style={{marginBottom:'24px'}}>Si el correo ingresado está registrado, recibirás un mensaje con instrucciones para restablecer tu contraseña.</p>
          <a href="/" className="btn-login" style={{width:'100%', textDecoration:'none'}}>Volver al inicio</a>
        </div>
      </div>
    </div>
  );
};

export default CorreoEnviado;
