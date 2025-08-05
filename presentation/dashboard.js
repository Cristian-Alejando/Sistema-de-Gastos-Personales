// presentation/dashboard.js
import {
  inicializarDashboard,
  cerrarSesion,
  procesarNuevoGasto,
  cargarGastos,
  obtenerCategorias,
  ordenarMovimientos,
  calcularResumenDesdeMovimientos,
  filtrarMovimientos
} from '../services/dashboardService.js';
import {
  renderizarMovimientos,
  renderizarCategorias,
  renderizarTotalesMensuales,
  renderizarGraficoCategorias,
  actualizarIcono,
  reinicializarGraficoSiEsNecesario
} from './renderHelpers.js';

let usuarioActual = null;
let graficoCategorias = null;
let ultimaConfigGrafico = null;
let movimientosActuales = [];
let ordenActual = { campo: null, direccion: 'asc' };
let filtrosAplicados = null;

document.getElementById('logout').addEventListener('click', cerrarSesion);

document.getElementById('form-gasto').addEventListener('submit', async (e) => {
  e.preventDefault();
  const mensaje = document.getElementById('mensaje-gasto');
  const formData = obtenerDatosFormulario();

  try {
    const resultado = await procesarNuevoGasto(formData);
    mensaje.textContent = resultado.mensaje;

    let movimientos = await cargarGastos(usuarioActual.uid);
    if (filtrosAplicados) {
      movimientos = filtrarMovimientos(movimientos, filtrosAplicados);
    }

    movimientosActuales = movimientos;
    aplicarOrdenYRender(movimientosActuales);
    e.target.reset();
  } catch (error) {
    console.error(error);
    mensaje.textContent = error.message;
  }
});

document.getElementById('orden-fecha').addEventListener('click', () => {
  ordenActual.campo = 'fecha';
  ordenActual.direccion = ordenActual.direccion === 'asc' ? 'desc' : 'asc';
  document.getElementById('orden-monto').textContent = 'Ordenar por monto ⬍';
  aplicarOrdenYRender(movimientosActuales);
  actualizarTextoOrden();
});

document.getElementById('orden-monto').addEventListener('click', () => {
  ordenActual.campo = 'monto';
  ordenActual.direccion = ordenActual.direccion === 'asc' ? 'desc' : 'asc';
  document.getElementById('orden-fecha').textContent = 'Ordenar por fecha ⬍';
  aplicarOrdenYRender(movimientosActuales);
  actualizarTextoOrden();
});

document.getElementById('btn-aplicar-filtros').addEventListener('click', async () => {
  const fechaInicio = document.getElementById('filtro-fecha-inicio').value;
  const fechaFin = document.getElementById('filtro-fecha-fin').value;
  const tipo = document.getElementById('filtro-tipo').value;
  const categoria = document.getElementById('filtro-categoria').value;

  filtrosAplicados = { fechaInicio, fechaFin, tipo, categoria };

  const movimientos = await cargarGastos(usuarioActual.uid);
  const filtrados = filtrarMovimientos(movimientos, filtrosAplicados);

  movimientosActuales = filtrados;
  aplicarOrdenYRender(movimientosActuales);

  filtros.classList.add('hidden');
  toggleBtn.classList.remove('active');
  toggleBtn.classList.toggle('filtro-activo', fechaInicio || fechaFin || tipo || categoria);
});

document.getElementById('btn-limpiar-filtros').addEventListener('click', async () => {
  limpiarFiltrosUI();

  const hoy = new Date();
  const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1).toISOString().slice(0, 10);
  const finMes = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0).toISOString().slice(0, 10);

  filtrosAplicados = { fechaInicio: inicioMes, fechaFin: finMes, tipo: '', categoria: '' };

  const movimientos = await cargarGastos(usuarioActual.uid);
  const filtrados = filtrarMovimientos(movimientos, filtrosAplicados);

  movimientosActuales = filtrados;
  aplicarOrdenYRender(movimientosActuales);

  filtros.classList.add('hidden');
  toggleBtn.classList.remove('active');
  toggleBtn.classList.remove('filtro-activo');
});

document.getElementById('categoria').addEventListener('change', function () {
  if (this.value === 'editar') {
    window.location.href = 'categorias.html';
  }
});

inicializarDashboard(async (user) => {
  usuarioActual = user;
  document.getElementById('usuario-email').textContent = `Sesión iniciada como: ${user.email}`;

  const movimientos = await cargarGastos(user.uid);

  const hoy = new Date();
  const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1).toISOString().slice(0, 10);
  const finMes = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0).toISOString().slice(0, 10);

  filtrosAplicados = { fechaInicio: inicioMes, fechaFin: finMes, tipo: '', categoria: '' };
  const filtrados = filtrarMovimientos(movimientos, filtrosAplicados);

  movimientosActuales = filtrados;
  aplicarOrdenYRender(movimientosActuales);

  const categorias = await obtenerCategorias(user.uid);
  renderizarCategorias(categorias);

  actualizarIcono();
});

function aplicarOrdenYRender(movs) {
  const ordenados = ordenarMovimientos(movs, ordenActual.campo, ordenActual.direccion);
  renderizarMovimientos(ordenados);
  const resumen = calcularResumenDesdeMovimientos(ordenados);
  renderizarTotalesMensuales(resumen);
  renderizarGraficoCategorias(resumen);
}

function actualizarTextoOrden() {
  const simbolo = ordenActual.direccion === 'asc' ? '↑' : '↓';
  document.getElementById(
    ordenActual.campo === 'fecha' ? 'orden-fecha' : 'orden-monto'
  ).textContent = `Ordenar por ${ordenActual.campo} ${simbolo}`;
}

function obtenerDatosFormulario() {
  return {
    uid: usuarioActual.uid,
    descripcion: document.getElementById('descripcion').value.trim(),
    monto: parseFloat(document.getElementById('monto').value),
    fecha: document.getElementById('fecha').value,
    categoria: document.getElementById('categoria').value,
    tipo: document.getElementById('categoria').selectedOptions[0]?.dataset.tipo
  };
}

function limpiarFiltrosUI() {
  document.getElementById('filtro-fecha-inicio').value = '';
  document.getElementById('filtro-fecha-fin').value = '';
  document.getElementById('filtro-tipo').value = '';
  document.getElementById('filtro-categoria').value = '';
}

window.addEventListener('resize', () => {
  reinicializarGraficoSiEsNecesario(ultimaConfigGrafico);
});
