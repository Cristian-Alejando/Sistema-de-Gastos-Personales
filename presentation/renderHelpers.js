// presentation/renderHelpers.js

let graficoCategorias = null;

export function renderizarMovimientos(movimientos) {
  const tbody = document.getElementById('tabla-gastos');
  tbody.innerHTML = '';

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

export function renderizarCategorias(categorias) {
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

export function renderizarTotalesMensuales(resumen) {
  const contenedor = document.getElementById('resumen-mensual');
  if (!contenedor) return;

  contenedor.innerHTML = `
    <h3>Resumen por filtros</h3>
    <p><strong>Ingresos:</strong> $${resumen.ingresos.toFixed(2)}</p>
    <p><strong>Gastos:</strong> $${resumen.gastos.toFixed(2)}</p>
    <h4>Por categoría:</h4>
    <ul>
      ${Object.entries(resumen.porCategoria).map(([cat, monto]) =>
        `<li>${cat}: $${monto.toFixed(2)}</li>`).join('')}
    </ul>
  `;
}

export function renderizarGraficoCategorias(resumen) {
  const canvas = document.getElementById('grafico-categorias');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');

  if (graficoCategorias) {
    graficoCategorias.destroy();
  }

  graficoCategorias = new Chart(ctx, {
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
  });
}

export function actualizarIcono() {
  const icono = document.getElementById('filtro-icono');
  const toggleBtn = document.getElementById('toggle-filtros');
  if (document.getElementById('filtros').classList.contains('hidden')) {
    toggleBtn.classList.remove('active');
    icono.textContent = '⯈';
  } else {
    toggleBtn.classList.add('active');
    icono.textContent = '⯆';
  }
}

export function reinicializarGraficoSiEsNecesario(config) {
  const canvas = document.getElementById('grafico-categorias');
  if (!canvas || !config) return;

  const ctx = canvas.getContext('2d');
  if (graficoCategorias) {
    graficoCategorias.destroy();
  }

  graficoCategorias = new Chart(ctx, config);
}
