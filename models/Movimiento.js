// models/Movimiento.js
export function crearMovimiento({ uid, descripcion, monto, fecha, categoria, tipo }) {
  if (!uid || typeof uid !== 'string') {
    throw new Error("UID inválido");
  }

  if (!descripcion || typeof descripcion !== 'string' || descripcion.trim() === '') {
    throw new Error("Descripción inválida");
  }

  const montoNum = parseFloat(monto);
  if (isNaN(montoNum) || montoNum <= 0) {
    throw new Error("Monto debe ser un número positivo");
  }

  const fechaObj = new Date(fecha);
  if (isNaN(fechaObj.getTime()) || fechaObj > new Date()) {
    throw new Error("Fecha inválida o futura");
  }

  if (!categoria || typeof categoria !== 'string') {
    throw new Error("Categoría inválida");
  }

  if (!tipo || !['Ingreso', 'Gasto'].includes(tipo)) {
    throw new Error("Tipo debe ser 'Ingreso' o 'Gasto'");
  }

  return {
    uid,
    descripcion: descripcion.trim(),
    monto: montoNum,
    fecha: fechaObj.toISOString().split("T")[0], // "YYYY-MM-DD"
    categoria,
    tipo
  };
}
