import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged
} from "firebase/auth";

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "meovacinas-6fecc.firebaseapp.com",
  projectId: "meovacinas-6fecc",
  storageBucket: "meovacinas-6fecc.firebasestorage.app",
  messagingSenderId: "468586301201",
  appId: "1:468586301201:web:53c53a481569133532aeb0",
  measurementId: "G-51X0DR1J7Q"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);

// Serviços
export const db = getFirestore(app);
export const auth = getAuth(app);

// Analytics
let analytics;
if (typeof window !== "undefined") {
  analytics = getAnalytics(app);
}
export { analytics };

// Login Google
export const googleProvider = new GoogleAuthProvider();

// Exportar funções
export { signInWithPopup, signOut, onAuthStateChanged };
