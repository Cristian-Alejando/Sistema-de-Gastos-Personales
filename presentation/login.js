// login.js
import { loginUser } from '../services/authService.js';

const loginForm = document.getElementById('login-form');
const mensaje = document.getElementById('mensaje');

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  try {
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
