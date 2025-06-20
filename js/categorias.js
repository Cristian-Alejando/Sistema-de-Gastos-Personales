import { db, auth } from './firebase-config.js';
import { ref, push, onValue } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";

const formCategoria = document.getElementById('form-categoria');
const mensaje = document.getElementById('mensaje-categoria');
const tabla = document.getElementById('tabla-categorias');

let uid = null;

onAuthStateChanged(auth, user => {
  if (user) {
    uid = user.uid;
    cargarCategorias();
    formCategoria.addEventListener('submit', guardarCategoria);
  } else {
    mensaje.textContent = 'Debes iniciar sesión.';
    formCategoria.querySelectorAll('input, select, button').forEach(el => el.disabled = true);
  }
});

async function guardarCategoria(e) {
  e.preventDefault();
  const nombre = document.getElementById('nombre').value.trim();
  const tipo = document.getElementById('tipo').value;

  if (!nombre || !tipo) {
    mensaje.textContent = 'Por favor completa todos los campos.';
    return;
  }

  const nuevaCategoria = { nombre, tipo };

  try {
    const categoriasRef = ref(db, `usuarios/${uid}/categorias/${tipo.toLowerCase()}`);
    await push(categoriasRef, nuevaCategoria);
    mensaje.textContent = 'Categoría guardada correctamente.';
    formCategoria.reset();
    cargarCategorias();
  } catch (error) {
    console.error("Error al guardar categoría:", error);
    mensaje.textContent = `Error: ${error.message}`;
  }
}

function cargarCategorias() {
  const categoriasGastoRef = ref(db, `usuarios/${uid}/categorias/gasto`);
  const categoriasIngresoRef = ref(db, `usuarios/${uid}/categorias/ingreso`);
  tabla.innerHTML = '';

  const render = (snapshot, tipo) => {
    if (snapshot.exists()) {
      const categorias = snapshot.val();
      Object.values(categorias).forEach(cat => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${cat.nombre}</td>
          <td>${tipo}</td>
        `;
        tabla.appendChild(row);
      });
    }
  };

  onValue(categoriasGastoRef, (snap) => render(snap, 'Gasto'), { onlyOnce: true });
  onValue(categoriasIngresoRef, (snap) => render(snap, 'Ingreso'), { onlyOnce: true });
}
