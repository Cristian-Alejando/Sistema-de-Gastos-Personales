// models/Categoria.js
export function crearCategoria({ nombre, tipo }) {
  if (!nombre || typeof nombre !== 'string' || nombre.trim() === '') {
    throw new Error("Nombre de categoría inválido");
  }

  if (!tipo || !['Ingreso', 'Gasto'].includes(tipo)) {
    throw new Error("Tipo de categoría debe ser 'Ingreso' o 'Gasto'");
  }

  return {
    nombre: nombre.trim(),
    tipo
  };
}
