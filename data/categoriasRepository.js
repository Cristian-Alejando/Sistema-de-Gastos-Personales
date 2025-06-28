import { db } from './firebase-config.js';
import { ref, push, onValue } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js";

export async function guardarCategoriaEnDB(uid, categoria) {
  const categoriasRef = ref(db, `usuarios/${uid}/categorias/${categoria.tipo.toLowerCase()}`);
  return await push(categoriasRef, categoria);
}

export function obtenerCategoriasDesdeDB(uid) {
  return new Promise((resolve) => {
    const resultado = { gasto: [], ingreso: [] };

    const gastoRef = ref(db, `usuarios/${uid}/categorias/gasto`);
    const ingresoRef = ref(db, `usuarios/${uid}/categorias/ingreso`);

    onValue(gastoRef, (snap) => {
      if (snap.exists()) resultado.gasto = Object.values(snap.val());

      onValue(ingresoRef, (snap2) => {
        if (snap2.exists()) resultado.ingreso = Object.values(snap2.val());
        resolve(resultado);
      }, { onlyOnce: true });

    }, { onlyOnce: true });
  });
}
