// login.js
import { auth } from './firebase-config.js';
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const loginForm = document.getElementById('login-form');
const mensaje = document.getElementById('mensaje');

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    if (user.emailVerified) {
      window.location.href = 'dashboard.html';
    } else {
      mensaje.textContent = 'Por favor verifica tu correo antes de iniciar sesión.';
    }
  } catch (error) {
    mensaje.textContent = `Error: ${error.message}`;
  }
});