// services/dashboardService.js
import { cerrarSesionFirebase, onUserChange } from '../data/authRepository.js';
import {
  guardarGastoEnDB,
  obtenerCategorias,
  obtenerGastos
} from '../data/dashboardRepository.js';
import { crearMovimiento } from '../models/Movimiento.js';

export function inicializarDashboard(callback) {
  onUserChange((user) => {
    if (!user || !user.emailVerified) return redirigirAlogin();
    if (callback) callback(user);
  });
}

export async function procesarNuevoGasto(formData) {
  const { descripcion, monto, fecha, categoria, tipo } = formData;
  const fechaValida = !isNaN(Date.parse(fecha)) && new Date(fecha) <= new Date();
  if (!descripcion || isNaN(monto) || monto <= 0 || !fechaValida) {
    throw new Error('Por favor ingresa un monto positivo o fecha válida.');
  }
  if (!categoria || !tipo) {
    throw new Error('Selecciona una categoría válida.');
  }

  const movimiento = crearMovimiento(formData);
  await guardarGastoEnDB(movimiento);
  return { mensaje: '¡Gasto guardado correctamente!' };
}

export async function cargarGastos(uid) {
  return await obtenerGastos(uid);
}

export function cerrarSesion() {
  cerrarSesionFirebase().then(() => redirigirAlogin());
}

export { obtenerCategorias };

function redirigirAlogin() {
  window.location.href = 'index.html';
}

export function ordenarMovimientos(movs, campo, direccion) {
  const sorted = [...movs];
  sorted.sort((a, b) => {
    let valA = a[campo];
    let valB = b[campo];

    if (campo === 'fecha') {
      valA = new Date(valA);
      valB = new Date(valB);
    }

    if (valA < valB) return direccion === 'asc' ? -1 : 1;
    if (valA > valB) return direccion === 'asc' ? 1 : -1;
    return 0;
  });
  return sorted;
}

export function calcularResumenDesdeMovimientos(movimientos) {
  const resumen = {
    ingresos: 0,
    gastos: 0,
    porCategoria: {}
  };

  movimientos.forEach(mov => {
    const monto = parseFloat(mov.monto);
    const tipo = mov.tipo.toLowerCase();

    if (tipo === 'ingreso') resumen.ingresos += monto;
    else if (tipo === 'gasto') resumen.gastos += monto;

    const clave = mov.categoria;
    if (!resumen.porCategoria[clave]) resumen.porCategoria[clave] = 0;
    resumen.porCategoria[clave] += monto;
  });

  return resumen;
}

export function filtrarMovimientos(movimientos, { fechaInicio, fechaFin, tipo, categoria }) {
  return movimientos.filter(mov => {
    const fechaMov = new Date(mov.fecha);
    const cumpleFechaInicio = fechaInicio ? fechaMov >= new Date(fechaInicio) : true;
    const cumpleFechaFin = fechaFin ? fechaMov <= new Date(fechaFin) : true;
    const cumpleTipo = tipo ? mov.tipo === tipo : true;
    const cumpleCategoria = categoria ? mov.categoria === categoria : true;
    return cumpleFechaInicio && cumpleFechaFin && cumpleTipo && cumpleCategoria;
  });
}
