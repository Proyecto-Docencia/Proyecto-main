document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const loginError = document.getElementById('loginError');

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault(); // Evita que el formulario se envíe de la forma tradicional

        const emailInput = document.getElementById('email');
        const email = emailInput.value.trim();
        // Obtener nombre desde el correo
        let nombre = '';
        if (email.includes('@')) {
            const partes = email.split('@')[0].split('.');
            nombre = partes.map(p => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase()).join(' ');
        }
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
            // Guardamos el email y el nombre para mostrarlo en el dashboard
            localStorage.setItem('userEmail', email);
            if (nombre) localStorage.setItem('userNombre', nombre);
            // Redirigimos al dashboard
            window.location.href = 'dashboard.html';
        }
    });
});