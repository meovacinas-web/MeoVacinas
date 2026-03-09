// Import Firebase
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { 
  getFirestore,
  collection,
  addDoc,
  onSnapshot,
  serverTimestamp
} from "firebase/firestore";

// Configuração do seu projeto
const firebaseConfig = {
  apiKey: "AIzaSyBAYAKfAUJYLensvAtPNiKeOgcAqBFKnJA",
  authDomain: "meovacinas-6fecc.firebaseapp.com",
  projectId: "meovacinas-6fecc",
  storageBucket: "meovacinas-6fecc.firebasestorage.app",
  messagingSenderId: "468586301201",
  appId: "1:468586301201:web:53c53a481569133532aeb0",
  measurementId: "G-51X0DR1J7Q"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// 🔥 Inicializa Firestore
export const db = getFirestore(app);

// referência da coleção
export const surveysRef = collection(db, "surveys");
