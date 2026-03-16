import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics, isSupported } from "firebase/analytics";

// New configuration for project: petbuddy-138
const firebaseConfig = {
  apiKey: "AIzaSyBI2pHqIKd_Uz0Rb3xJ2YH_IzhkKb7aRbM",
  authDomain: "petbuddy-138.firebaseapp.com",
  projectId: "petbuddy-138",
  storageBucket: "petbuddy-138.firebasestorage.app",
  messagingSenderId: "506859726227",
  appId: "1:506859726227:web:9083b07cceca26b8b6b466",
  measurementId: "G-JJFCRFMBZ9"
};

// 1. Initialize Firebase (Singleton pattern to prevent re-initialization errors)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// 2. Initialize Firestore Database
const db = getFirestore(app);

// 3. Safe Analytics (prevents errors during server-side rendering or non-browser environments)
let analytics;
if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) analytics = getAnalytics(app);
  });
}

export { db, analytics };