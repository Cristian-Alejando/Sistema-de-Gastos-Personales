import { register } from "../services/authService.js";

const registroForm = document.getElementById('registro-form');
const mensajeRegistro = document.getElementById('mensaje-registro');

registroForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('registro-email').value;
  const password = document.getElementById('registro-password').value;

  try {
    const user = await register(email, password);
    mensajeRegistro.textContent = `Cuenta creada. Verifica tu correo antes de iniciar sesión.`;

    setTimeout(() => {
      window.location.href = "index.html";
    }, 5000);
  } catch (error) {
    mensajeRegistro.textContent = `Error: ${error.message}`;
  }
});
