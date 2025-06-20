// js/firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyAltCEsUa2jSr8qVcmp3VHrTt6tdeKTXS8",
  authDomain: "gastos-personales-b2e5b.firebaseapp.com",
  databaseURL: "https://gastos-personales-b2e5b-default-rtdb.firebaseio.com",
  projectId: "gastos-personales-b2e5b",
  storageBucket: "gastos-personales-b2e5b.appspot.com",
  messagingSenderId: "536785705531",
  appId: "1:536785705531:web:87c37987769f128d93da1e",
  measurementId: "G-XQB42X3NGB"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getDatabase(app);
