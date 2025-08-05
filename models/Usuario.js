// models/Usuario.js
export function crearUsuario({ uid, email, nombre, creadoEn }) {
  if (!uid || typeof uid !== 'string') {
    throw new Error("UID inválido");
  }
  if (!email || typeof email !== 'string' || !email.includes('@')) {
    throw new Error("Correo electrónico inválido");
  }
  if (!nombre || typeof nombre !== 'string' || nombre.trim().length < 3) {
    throw new Error("Nombre inválido");
  }
  const fecha = new Date(creadoEn);
  if (isNaN(fecha.getTime())) {
    throw new Error("Fecha de creación inválida");
  }

  return {
    uid,
    email: email.trim().toLowerCase(),
    nombre: nombre.trim(),
    creadoEn: fecha.toISOString()
  };
}
