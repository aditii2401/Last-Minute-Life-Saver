import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Paste YOUR firebaseConfig here
const firebaseConfig = {
  apiKey: "AIzaSyAT-wi1XJvv84ufiLApLPAmhc9895Ffis0",
  authDomain: "ai-life-saver.firebaseapp.com",
  projectId: "ai-life-saver",
  storageBucket: "ai-life-saver.firebasestorage.app",
  messagingSenderId: "205210201076",
  appId: "1:205210201076:web:d6636af3856c098dfd27a1",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);