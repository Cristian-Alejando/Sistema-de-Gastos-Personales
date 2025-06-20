import { auth, db } from './firebase-config.js';
import { ref, push, onValue } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";

const emailLabel = document.getElementById('usuario-email');
const logoutButton = document.getElementById('logout');
const formGasto = document.getElementById('form-gasto');
const mensajeGasto = document.getElementById('mensaje-gasto');
const selectCategoria = document.getElementById('categoria');
const tabla = document.getElementById('tabla-gastos');

let usuarioActual = null;

onAuthStateChanged(auth, user => {
  if (user && user.emailVerified) {
    usuarioActual = user;
    emailLabel.textContent = `Sesión iniciada como: ${user.email}`;
    cargarCategorias();
    cargarGastos();
  } else {
    window.location.href = 'index.html';
  }
});

logoutButton.addEventListener('click', () => {
  signOut(auth).then(() => {
    window.location.href = 'index.html';
  });
});

formGasto.addEventListener('submit', async (e) => {
  e.preventDefault();

  const descripcion = document.getElementById('descripcion').value;
  const monto = parseFloat(document.getElementById('monto').value);
  const fecha = document.getElementById('fecha').value;
  const categoriaNombre = selectCategoria.value;
  const tipo = selectCategoria.selectedOptions[0]?.dataset.tipo;

  if (!categoriaNombre || !tipo) {
    mensajeGasto.textContent = 'Selecciona una categoría válida.';
    return;
  }

  const nuevoGasto = {
    descripcion: descripcion.trim(),
    monto,
    fecha,
    categoria: categoriaNombre,
    tipo
  };

  try {
    await push(ref(db, `usuarios/${usuarioActual.uid}/movimientos`), nuevoGasto);
    mensajeGasto.textContent = '¡Gasto/Ingreso guardado correctamente!';
    formGasto.reset();
    cargarGastos();
  } catch (error) {
    console.error("Error al guardar gasto:", error);
    mensajeGasto.textContent = `Error: ${error.message}`;
  }
});

function cargarGastos() {
  const gastosRef = ref(db, `usuarios/${usuarioActual.uid}/movimientos`);
  tabla.innerHTML = '';

  onValue(gastosRef, (snapshot) => {
    if (snapshot.exists()) {
      const movimientos = snapshot.val();
      Object.values(movimientos).forEach(mov => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${mov.descripcion}</td>
          <td>$${mov.monto.toFixed(2)}</td>
          <td>${mov.fecha}</td>
          <td>${mov.categoria} (${mov.tipo})</td>
        `;
        tabla.appendChild(row);
      });
    } else {
      tabla.innerHTML = `<tr><td colspan="4">No hay movimientos registrados.</td></tr>`;
    }
  });
}

function cargarCategorias() {
  const gastoRef = ref(db, `usuarios/${usuarioActual.uid}/categorias/gasto`);
  const ingresoRef = ref(db, `usuarios/${usuarioActual.uid}/categorias/ingreso`);
  selectCategoria.innerHTML = '';

  const defaultOption = document.createElement('option');
  defaultOption.value = '';
  defaultOption.textContent = 'Selecciona categoría';
  selectCategoria.appendChild(defaultOption);

  const renderOptions = (snapshot, tipo) => {
    if (snapshot.exists()) {
      const categorias = snapshot.val();
      Object.values(categorias).forEach(cat => {
        const option = document.createElement('option');
        option.value = cat.nombre;
        option.dataset.tipo = tipo;
        option.textContent = `${cat.nombre} (${tipo})`;
        selectCategoria.appendChild(option);
      });
    }
  };

  onValue(gastoRef, (snap) => renderOptions(snap, 'Gasto'), { onlyOnce: true });
  onValue(ingresoRef, (snap) => renderOptions(snap, 'Ingreso'), { onlyOnce: true });

  const editarOption = document.createElement('option');
  editarOption.value = 'editar';
  editarOption.textContent = '➕ Editar categorías...';
  selectCategoria.appendChild(editarOption);
}

selectCategoria.addEventListener('change', function () {
  if (this.value === 'editar') {
    window.location.href = 'categorias.html';
  }
});
