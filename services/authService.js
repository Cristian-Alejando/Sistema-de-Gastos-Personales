//authServices.js:
import {
  registerUser,
  sendVerificationEmail,
  saveUserInDatabase,
  loginUser as loginUserRepo
} from "../data/authRepository.js";
import { crearUsuario } from '../models/Usuario.js';

export const register = async (email, password, nombre) => {
  try {
    const userCredential = await registerUser(email, password);
    const user = userCredential.user;

    const usuarioFormateado = crearUsuario({
      uid: user.uid,
      email: user.email,
      nombre: nombre,
      creadoEn: new Date().toISOString()
    });

    await saveUserInDatabase(user.uid, usuarioFormateado);
    await sendVerificationEmail(user);
    return user;
  } catch (error) {
    throw error;
  }
};

export async function loginUser(email, password) {
  const userCredential = await loginUserRepo(email, password);
  return userCredential.user;
}