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

export async function calcularTotalesMensuales(uid) {
  const movimientos = await obtenerGastos(uid);
  const hoy = new Date();
  const mesActual = hoy.getMonth();
  const anioActual = hoy.getFullYear();

  const resumen = {
    ingresos: 0,
    gastos: 0,
    porCategoria: {}
  };

  movimientos.forEach(mov => {
    const fecha = new Date(mov.fecha);
    if (fecha.getMonth() === mesActual && fecha.getFullYear() === anioActual) {
      const monto = parseFloat(mov.monto);
      const tipo = mov.tipo.toLowerCase();

      if (tipo === 'ingreso') resumen.ingresos += monto;
      else if (tipo === 'gasto') resumen.gastos += monto;

      const clave = mov.categoria;
      if (!resumen.porCategoria[clave]) resumen.porCategoria[clave] = 0;
      resumen.porCategoria[clave] += monto;
    }
  });

  return resumen;
}