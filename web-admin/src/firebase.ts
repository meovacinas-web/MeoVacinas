import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  projectId: "gen-lang-client-0586561982",
  appId: "1:492721192363:web:89e237491f87673e8de6ee",
  apiKey: "AIzaSyC20Cb3_XqWEhYjtyJ5W3lmNGo1G8wfSu4",
  authDomain: "gen-lang-client-0586561982.firebaseapp.com",
  storageBucket: "gen-lang-client-0586561982.firebasestorage.app",
  messagingSenderId: "492721192363",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, "ai-studio-8b591efa-269b-4b1e-a7aa-9efa9ebf4c05");
export const auth = getAuth(app);
