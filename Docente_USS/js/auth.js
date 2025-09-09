document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const loginError = document.getElementById('loginError');

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault(); // Evita que el formulario se envíe de la forma tradicional

        const emailInput = document.getElementById('email');
        const email = emailInput.value.trim();
        const password = document.getElementById('password').value;
        loginError.textContent = '';

        // Validación de correo institucional
        var regex = /^[^@\s]+@docente\.uss\.cl$/i;
        if (email === '' || password === '') {
            loginError.textContent = 'Por favor, ingrese correo y contraseña.';
            loginError.style.display = 'block';
            emailInput.focus();
            return;
        } else if (!regex.test(email)) {
            loginError.textContent = 'El correo debe ser institucional y terminar en @docente.uss.cl';
            loginError.style.display = 'block';
            emailInput.focus();
            return;
        } else {
            loginError.style.display = 'none';
            // Guardamos el email para mostrarlo en el dashboard
            localStorage.setItem('userEmail', email);
            // Redirigimos al dashboard
            window.location.href = 'dashboard.html';
        }
    });
});