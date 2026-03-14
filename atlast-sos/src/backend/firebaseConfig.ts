// Firebase Configuration
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyBCtQtqEiW2pnJ5sj1W9ju3BlweOVpyewE",
  authDomain: "petsos-lostsoos.firebaseapp.com",
  projectId: "petsos-lostsoos",
  storageBucket: "petsos-lostsoos.firebasestorage.app",
  messagingSenderId: "940226622852",
  appId: "1:940226622852:web:64310634466e00da9499d1"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;
