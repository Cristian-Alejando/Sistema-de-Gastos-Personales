//dashboardRepository.js:
import { db } from './firebase-config.js';
import { ref, push, onValue, get } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js";

export function guardarGastoEnDB(gasto) {
  const ruta = `usuarios/${gasto.uid}/movimientos`;
  return push(ref(db, ruta), gasto);
}

export function obtenerCategorias(uid) {
  return new Promise((resolve, reject) => {
    const categorias = { gasto: [], ingreso: [] };

    const gastoRef = ref(db, `usuarios/${uid}/categorias/gasto`);
    const ingresoRef = ref(db, `usuarios/${uid}/categorias/ingreso`);

    onValue(gastoRef, (snapGasto) => {
      if (snapGasto.exists()) {
        categorias.gasto = Object.values(snapGasto.val());
      }

      onValue(ingresoRef, (snapIngreso) => {
        if (snapIngreso.exists()) {
          categorias.ingreso = Object.values(snapIngreso.val());
        }

        resolve(categorias);
      }, { onlyOnce: true });

    }, { onlyOnce: true });
  });
}

export function obtenerGastos(uid) {
  return new Promise((resolve, reject) => {
    const gastosRef = ref(db, `usuarios/${uid}/movimientos`);

    onValue(gastosRef, (snapshot) => {
      if (snapshot.exists()) {
        const movimientos = Object.entries(snapshot.val()).map(([id, data]) => ({
          id,
          ...data,
        }));
        resolve(movimientos);
      } else {
        resolve([]); // No hay datos
      }
    }, (error) => {
      reject(error);
    }, { onlyOnce: true });
  });
}

export async function getMovimientoById(uid, id) {
  const snapshot = await get(ref(db, `usuarios/${uid}/movimientos/${id}`));
  if (snapshot.exists()) {
    return snapshot.val();
  } else {
    throw new Error("Movimiento no encontrado");
  }
}