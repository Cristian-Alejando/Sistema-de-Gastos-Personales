import { guardarCategoriaEnDB, obtenerCategoriasDesdeDB } from '../data/categoriasRepository.js';
import { crearCategoria } from '../models/Categoria.js';

export async function guardarCategoria(uid, categoria) {
  const nuevaCategoria = crearCategoria(categoria);
  await guardarCategoriaEnDB(uid, nuevaCategoria);
}

export async function obtenerCategorias(uid) {
  return await obtenerCategoriasDesdeDB(uid);
}
