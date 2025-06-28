import { guardarCategoriaEnDB, obtenerCategoriasDesdeDB } from '../data/categoriasRepository.js';

export async function guardarCategoria(uid, categoria) {
  await guardarCategoriaEnDB(uid, categoria);
}

export async function obtenerCategorias(uid) {
  return await obtenerCategoriasDesdeDB(uid);
}
