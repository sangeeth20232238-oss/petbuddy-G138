```javascript
import { initializeApp, getApps, getApp } from "firebase/app";
import { initializeAuth, getAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

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

// 2. Initialize Auth
let auth;
try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
  });
} catch (error) {
  auth = getAuth(app);
}

// 3. Initialize Firestore Database
const db = getFirestore(app);

export { db, auth };
```