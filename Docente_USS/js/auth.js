document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const loginError = document.getElementById('loginError');

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault(); // Evita que el formulario se envíe de la forma tradicional

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        loginError.textContent = ''; // Limpia mensajes de error previos

        // SIMULACIÓN DE LOGIN
        // En una aplicación real, aquí harías una llamada a un servidor (API)
        if (email.trim() === '' || password.trim() === '') {
            loginError.textContent = 'Por favor, ingrese correo y contraseña.';
        } else {
            // Guardamos el email para mostrarlo en el dashboard
            localStorage.setItem('userEmail', email);
            // Redirigimos al dashboard
            window.location.href = 'dashboard.html';
        }
    });
});