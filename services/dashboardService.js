//dasboardService.js:
import { cerrarSesionFirebase, onUserChange } from '../data/authRepository.js';
import { guardarGastoEnDB, obtenerCategorias, obtenerGastos } from '../data/dashboardRepository.js';

export function inicializarDashboard(callback) {
  onUserChange((user) => {
    if (!user || !user.emailVerified) return redirigirAlogin();
    if (callback) callback(user); // ✅ Solo lo llama si fue definido
  });
}

export async function guardarGasto(formData) {
  await guardarGastoEnDB(formData);
}

export function cerrarSesion() {
  cerrarSesionFirebase().then(() => redirigirAlogin());
}

export async function cargarGastos(uid) {
  const movimientos = await obtenerGastos(uid);
  return movimientos;
}

export { obtenerCategorias };

function redirigirAlogin() {
  window.location.href = 'index.html';
}