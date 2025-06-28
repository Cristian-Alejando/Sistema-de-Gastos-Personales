//authRepository.js:
import { auth, db } from "./firebase-config.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,   
  sendEmailVerification
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
import {
  ref,
  set
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js";
import { signOut } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
import {onValue } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js";


// Iniciar sesión
export const loginUser = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

// Crea un nuevo usuario
export const registerUser = (email, password) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

// Envía email de verificación
export const sendVerificationEmail = (user) => {
  return sendEmailVerification(user);
};

// Guarda datos en la base de datos
export const saveUserInDatabase = (uid, data) => {
  return set(ref(db, 'usuarios/' + uid), data);
};

export function cerrarSesionFirebase() {
  return signOut(auth);
}

export function onUserChange(callback) {
  onAuthStateChanged(auth, callback);
}
