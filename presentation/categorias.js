import { auth } from '../data/firebase-config.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
import { guardarCategoria, obtenerCategorias } from '../services/categoriasService.js';

const formCategoria = document.getElementById('form-categoria');
const mensaje = document.getElementById('mensaje-categoria');
const tabla = document.getElementById('tabla-categorias');

let uid = null;

onAuthStateChanged(auth, async user => {
  if (user) {
    uid = user.uid;
    formCategoria.addEventListener('submit', guardarCategoriaUI);
    const categorias = await obtenerCategorias(uid);
    renderizarCategorias(categorias);
  } else {
    mensaje.textContent = 'Debes iniciar sesión.';
    formCategoria.querySelectorAll('input, select, button').forEach(el => el.disabled = true);
  }
});

async function guardarCategoriaUI(e) {
  e.preventDefault();

  const nombre = document.getElementById('nombre').value.trim();
  const tipo = document.getElementById('tipo').value;

  if (!nombre || !tipo) {
    mensaje.textContent = 'Por favor completa todos los campos.';
    return;
  }

  try {
    await guardarCategoria(uid, { nombre, tipo });
    mensaje.textContent = 'Categoría guardada correctamente.';
    formCategoria.reset();

    const categorias = await obtenerCategorias(uid);
    renderizarCategorias(categorias);
  } catch (error) {
    console.error(error);
    mensaje.textContent = `Error: ${error.message}`;
  }
}

function renderizarCategorias(categorias) {
  tabla.innerHTML = '';

  const renderFila = (cat, tipo) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${cat.nombre}</td>
      <td>${tipo}</td>
    `;
    tabla.appendChild(row);
  };

  categorias.gasto.forEach(cat => renderFila(cat, 'Gasto'));
  categorias.ingreso.forEach(cat => renderFila(cat, 'Ingreso'));

  if (categorias.gasto.length + categorias.ingreso.length === 0) {
    const row = document.createElement('tr');
    row.innerHTML = `<td colspan="2">No hay categorías registradas.</td>`;
    tabla.appendChild(row);
  }
}
