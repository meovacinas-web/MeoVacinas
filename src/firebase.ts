import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBAYAKfAUJYLensvAtPNiKeOgcAqBFKnJA",
  authDomain: "meovacinas-6fecc.firebaseapp.com",
  projectId: "meovacinas-6fecc",
  storageBucket: "meovacinas-6fecc.firebasestorage.app",
  messagingSenderId: "468586301201",
  appId: "1:468586301201:web:53c53a481569133532aeb0",
  measurementId: "G-51X0DR1J7Q"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
