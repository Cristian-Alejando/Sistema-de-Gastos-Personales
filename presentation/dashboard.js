import {
  inicializarDashboard,
  cerrarSesion,
  guardarGasto,
  cargarGastos,
  obtenerCategorias,
  calcularTotalesMensuales,
} from '../services/dashboardService.js';

let usuarioActual = null;
let graficoCategorias = null;
let ultimaConfigGrafico = null;

document.getElementById('logout').addEventListener('click', cerrarSesion);

document.getElementById('form-gasto').addEventListener('submit', async (e) => {
  e.preventDefault();
  const mensaje = document.getElementById('mensaje-gasto');

  const descripcion = document.getElementById('descripcion').value.trim();
  const monto = parseFloat(document.getElementById('monto').value);
  const fecha = document.getElementById('fecha').value;
 
  const fechaValida = !isNaN(Date.parse(fecha)) && new Date(fecha) <= new Date();

if (!descripcion || isNaN(monto) || monto <= 0 || !fechaValida) {
  mensaje.textContent = 'Por favor ingresa un monto positivo o fecha válida.';
  return;
}

  const categoriaNombre = document.getElementById('categoria').value;
  const tipo = document.getElementById('categoria').selectedOptions[0]?.dataset.tipo;

  if (!categoriaNombre || !tipo) {
    mensaje.textContent = 'Selecciona una categoría válida.';
    return;
  }

  const formData = {
    uid: usuarioActual.uid,
    descripcion,
    monto,
    fecha,
    categoria: categoriaNombre,
    tipo
  };

  try {
    await guardarGasto(formData);
    mensaje.textContent = '¡Gasto guardado correctamente!';

    const movimientos = await cargarGastos(usuarioActual.uid);
    renderizarMovimientos(movimientos);
    e.target.reset(); // Limpia el formulario
  } catch (error) {
    console.error(error);
    mensaje.textContent = `Error: ${error.message}`;
  }
});

inicializarDashboard(async (user) => {
  usuarioActual = user;

  // Muestra correo del usuario
  document.getElementById('usuario-email').textContent = `Sesión iniciada como: ${user.email}`;

  // Carga gastos y categorías
  const movimientos = await cargarGastos(user.uid);
  renderizarMovimientos(movimientos);

  const categorias = await obtenerCategorias(user.uid);
  renderizarCategorias(categorias);
  
  const totales = await calcularTotalesMensuales(user.uid);
  renderizarTotalesMensuales(totales);
  renderizarGraficoCategorias(totales);
});

function renderizarMovimientos(movimientos) {
  const tbody = document.getElementById('tabla-gastos');
  tbody.innerHTML = ''; // limpia la tabla

  if (movimientos.length === 0) {
    const row = document.createElement('tr');
    row.innerHTML = `<td colspan="4">No hay movimientos registrados.</td>`;
    tbody.appendChild(row);
    return;
  }

  movimientos.forEach(mov => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${mov.descripcion}</td>
      <td>$${mov.monto.toFixed(2)}</td>
      <td>${mov.fecha}</td>
      <td>${mov.categoria} (${mov.tipo})</td>
    `;
    tbody.appendChild(row);
  });
}

function renderizarCategorias(categorias) {
  const select = document.getElementById('categoria');
  select.innerHTML = '<option value="">Selecciona categoría</option>';

  categorias.gasto.forEach(cat => {
    const option = document.createElement('option');
    option.value = cat.nombre;
    option.dataset.tipo = 'Gasto';
    option.textContent = `${cat.nombre} (Gasto)`;
    select.appendChild(option);
  });

  categorias.ingreso.forEach(cat => {
    const option = document.createElement('option');
    option.value = cat.nombre;
    option.dataset.tipo = 'Ingreso';
    option.textContent = `${cat.nombre} (Ingreso)`;
    select.appendChild(option);
  });

  const editarOption = document.createElement('option');
  editarOption.value = 'editar';
  editarOption.textContent = '➕ Editar categorías...';
  select.appendChild(editarOption);

  // También llena el filtro de categoría
const filtroSelect = document.getElementById('filtro-categoria');
if (filtroSelect) {
  filtroSelect.innerHTML = '<option value="">Todas</option>';
  categorias.gasto.forEach(cat => {
    const option = document.createElement('option');
    option.value = cat.nombre;
    option.textContent = `${cat.nombre} (Gasto)`;
    filtroSelect.appendChild(option);
  });

  categorias.ingreso.forEach(cat => {
    const option = document.createElement('option');
    option.value = cat.nombre;
    option.textContent = `${cat.nombre} (Ingreso)`;
    filtroSelect.appendChild(option);
  });
}
}

function renderizarTotalesMensuales(resumen) {
  const contenedor = document.getElementById('resumen-mensual');
  if (!contenedor) return;

  contenedor.innerHTML = `
    <h3>Resumen del mes</h3>
    <p><strong>Ingresos:</strong> $${resumen.ingresos.toFixed(2)}</p>
    <p><strong>Gastos:</strong> $${resumen.gastos.toFixed(2)}</p>
    <h4>Por categoría:</h4>
    <ul>
      ${Object.entries(resumen.porCategoria).map(([cat, monto]) =>
        `<li>${cat}: $${monto.toFixed(2)}</li>`
      ).join('')}
    </ul>
  `;
}

function renderizarGraficoCategorias(resumen) {
  const canvas = document.getElementById('grafico-categorias');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');

  if (graficoCategorias) {
    graficoCategorias.destroy();
  }

  // Guardamos la configuración para poder reusar en resize
  ultimaConfigGrafico = {
    type: 'bar',
    data: {
      labels: Object.keys(resumen.porCategoria),
      datasets: [{
        label: 'Monto por categoría',
        data: Object.values(resumen.porCategoria),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: { beginAtZero: true }
      }
    }
  };

  graficoCategorias = new Chart(ctx, ultimaConfigGrafico);
}

function calcularResumenDesdeMovimientos(movimientos) {
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

document.getElementById('categoria').addEventListener('change', function () {
  if (this.value === 'editar') {
    window.location.href = 'categorias.html';
  }
});

document.getElementById('btn-aplicar-filtros').addEventListener('click', async () => {
  const fechaInicio = document.getElementById('filtro-fecha-inicio').value;
  const fechaFin = document.getElementById('filtro-fecha-fin').value;
  const tipo = document.getElementById('filtro-tipo').value;
  const categoria = document.getElementById('filtro-categoria').value;

  const movimientos = await cargarGastos(usuarioActual.uid);

  const filtrados = movimientos.filter(mov => {
    const fechaMov = new Date(mov.fecha);
    const cumpleFechaInicio = fechaInicio ? fechaMov >= new Date(fechaInicio) : true;
    const cumpleFechaFin = fechaFin ? fechaMov <= new Date(fechaFin) : true;
    const cumpleTipo = tipo ? mov.tipo === tipo : true;
    const cumpleCategoria = categoria ? mov.categoria === categoria : true;
    return cumpleFechaInicio && cumpleFechaFin && cumpleTipo && cumpleCategoria;
  });

  renderizarMovimientos(filtrados);
  const resumenFiltrado = calcularResumenDesdeMovimientos(filtrados);
  renderizarTotalesMensuales(resumenFiltrado);
  renderizarGraficoCategorias(resumenFiltrado);
});

window.addEventListener('resize', () => {
  if (ultimaConfigGrafico) {
    const canvas = document.getElementById('grafico-categorias');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (graficoCategorias) {
      graficoCategorias.destroy();
    }

    graficoCategorias = new Chart(ctx, ultimaConfigGrafico);
  }
});
