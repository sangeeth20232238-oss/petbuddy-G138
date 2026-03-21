import { initializeApp, getApps, getApp } from "firebase/app";
import { initializeAuth, getAuth, getReactNativePersistence, browserLocalPersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from 'react-native';

const firebaseConfig = {
    apiKey: "AIzaSyBI2pHqIKd_Uz0Rb3xJ2YH_IzhkKb7aRbM",
    authDomain: "petbuddy-138.firebaseapp.com",
    databaseURL: "https://petbuddy-138-default-rtdb.firebaseio.com",
    projectId: "petbuddy-138",
    storageBucket: "petbuddy-138.firebasestorage.app",
    messagingSenderId: "506859726227",
    appId: "1:506859726227:web:9083b07cceca26b8b6b466",
    measurementId: "G-JJFCRFMBZ9"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

let auth;
try {
    const persistence = Platform.OS === 'web' 
        ? browserLocalPersistence 
        : getReactNativePersistence(ReactNativeAsyncStorage);
    auth = initializeAuth(app, { persistence });
} catch {
    auth = getAuth(app);
}

const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };