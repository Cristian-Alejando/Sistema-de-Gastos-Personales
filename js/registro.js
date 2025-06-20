import { auth, db } from './firebase-config.js'; // Asegúrate de exportar `db` desde firebase-config.js
import { ref, set } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";
import { createUserWithEmailAndPassword, sendEmailVerification } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const registroForm = document.getElementById('registro-form');
const mensajeRegistro = document.getElementById('mensaje-registro');

registroForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('registro-email').value;
  const password = document.getElementById('registro-password').value;

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // 1. Guardar el usuario en la base de datos
    await set(ref(db, 'usuarios/' + user.uid), {
      email: user.email,
      creadoEn: new Date().toISOString()
    });

    // 2. Enviar verificación
    await sendEmailVerification(user);
    mensajeRegistro.textContent = `Cuenta creada. Verifica tu correo antes de iniciar sesión.`;

    setTimeout(() => {
      window.location.href = "index.html";
    }, 5000);

  } catch (error) {
    mensajeRegistro.textContent = `Error: ${error.message}`;
  }
});
