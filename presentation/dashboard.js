import {
  inicializarDashboard,
  cerrarSesion,
  guardarGasto,
  cargarGastos,
  obtenerCategorias
} from '../services/dashboardService.js';

let usuarioActual = null;

document.getElementById('logout').addEventListener('click', cerrarSesion);

document.getElementById('form-gasto').addEventListener('submit', async (e) => {
  e.preventDefault();
  const mensaje = document.getElementById('mensaje-gasto');

  const descripcion = document.getElementById('descripcion').value.trim();
  const monto = parseFloat(document.getElementById('monto').value);
  const fecha = document.getElementById('fecha').value;
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
}

document.getElementById('categoria').addEventListener('change', function () {
  if (this.value === 'editar') {
    window.location.href = 'categorias.html';
  }
});

