import { Eye, EyeOff, createElement } from 'https://unpkg.com/lucide@latest/dist/esm/lucide.js';

document.addEventListener('DOMContentLoaded', () => {
  const registroForm = document.getElementById('registro-form');
  const mensajeRegistro = document.getElementById('mensaje-registro');

  const toggleFields = [
    {
      input: document.getElementById('password'),
      toggle: document.getElementById('toggle-password')
    },
    {
      input: document.getElementById('confirmar-password'),
      toggle: document.getElementById('toggle-confirm-password')
    }
  ];

  toggleFields.forEach(({ input, toggle }) => {
    // Asegura que el icono esté limpio
    toggle.innerHTML = '';
    toggle.appendChild(createElement(EyeOff));
    toggle.dataset.visible = 'false';

    toggle.addEventListener('click', () => {
      const isVisible = toggle.dataset.visible === 'true';
      input.type = isVisible ? 'password' : 'text';

      // Limpia el contenido antes de volver a insertar
      toggle.innerHTML = '';
      toggle.appendChild(createElement(isVisible ? EyeOff : Eye));
      toggle.dataset.visible = (!isVisible).toString();
    });
  });

  registroForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const nombre = document.getElementById('registro-nombre').value.trim();
    const email = document.getElementById('registro-email').value.trim();
    const password = document.getElementById('password').value;
    const confirmar = document.getElementById('confirmar-password').value;

    if (!nombre || nombre.length < 3) {
      mensajeRegistro.textContent = "Por favor ingresa un nombre válido.";
      return;
    }

    if (password.length < 6) {
      mensajeRegistro.textContent = "La contraseña debe tener al menos 6 caracteres.";
      return;
    }

    if (password !== confirmar) {
      mensajeRegistro.textContent = "Las contraseñas no coinciden.";
      return;
    }

    try {
      const { register } = await import('../services/authService.js');
      await register(email, password, nombre);
      mensajeRegistro.textContent = "Cuenta creada. Verifica tu correo antes de iniciar sesión.";
      setTimeout(() => {
        window.location.href = "index.html";
      }, 5000);
    } catch (error) {
      mensajeRegistro.textContent = `Error: ${error.message}`;
    }
  });
});
