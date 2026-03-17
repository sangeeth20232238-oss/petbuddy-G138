import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
    apiKey: "AIzaSyBI2pHqIKd_Uz0Rb3xJ2YH_IzhkKb7aRbM",
    authDomain: "petbuddy-138.firebaseapp.com",
    projectId: "petbuddy-138",
    storageBucket: "petbuddy-138.firebasestorage.app",
    messagingSenderId: "506859726227",
    appId: "1:506859726227:web:9083b07cceca26b8b6b466",
    measurementId: "G-JJFCRFMBZ9"
};

// 1. Initialize App
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// 2. Initialize Auth with a "Persistence First" strategy
let auth;
try {
    // We try to initialize with storage. If this fails, it's usually 
    // because it was already initialized during a hot-reload.
    auth = initializeAuth(app, {
        persistence: getReactNativePersistence(ReactNativeAsyncStorage),
    });
} catch (error) {
    // Fallback to getting the existing instance
    auth = getAuth(app);
}

const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };