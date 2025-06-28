//authServices.js:
import {
  registerUser,
  sendVerificationEmail,
  saveUserInDatabase,
  loginUser as loginUserRepo
} from "../data/authRepository.js";

export const register = async (email, password) => {
  try {
    const userCredential = await registerUser(email, password);
    const user = userCredential.user;

    await saveUserInDatabase(user.uid, {
      email: user.email,
      creadoEn: new Date().toISOString()
    });

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