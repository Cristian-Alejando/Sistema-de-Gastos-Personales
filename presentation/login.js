import { Eye, EyeOff, createElement } from 'https://unpkg.com/lucide@latest/dist/esm/lucide.js';

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('login-form');
  const mensaje = document.getElementById('mensaje');
  const passwordInput = document.getElementById('login-password');
  const togglePassword = document.getElementById('toggle-login-password');

  function renderIcon(isVisible) {
    console.log('renderIcon llamado. Visible:', isVisible);

    // Eliminar todos los íconos previos (por si acaso)
    togglePassword.querySelectorAll('svg').forEach(svg => svg.remove());

    // Asegurar que no haya duplicados por cualquier cambio en el DOM
    if (!togglePassword.querySelector('svg')) {
      const icon = createElement(isVisible ? Eye : EyeOff);
      togglePassword.appendChild(icon);
      togglePassword.dataset.visible = isVisible.toString();
    }
  }

  // Solo renderizar si no hay íconos previos
  if (!togglePassword.querySelector('svg')) {
    renderIcon(false);
  }

  togglePassword.addEventListener('click', () => {
    const isVisible = togglePassword.dataset.visible === 'true';
    passwordInput.type = isVisible ? 'password' : 'text';
    renderIcon(!isVisible);
  });

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = passwordInput.value;

    try {
      const { loginUser } = await import('../services/authService.js');
      const user = await loginUser(email, password);

      if (user.emailVerified) {
        window.location.href = 'dashboard.html';
      } else {
        mensaje.textContent = 'Por favor verifica tu correo antes de iniciar sesión.';
      }
    } catch (error) {
      mensaje.textContent = `Error: ${error.message}`;
    }
  });
});
