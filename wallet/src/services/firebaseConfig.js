import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyBI2pHqIKd_Uz0Rb3xJ2YH_IzhkKb7aRbM',
  authDomain: 'petbuddy-138.firebaseapp.com',
  databaseURL: 'https://petbuddy-138-default-rtdb.firebaseio.com',
  projectId: 'petbuddy-138',
  storageBucket: 'petbuddy-138.firebasestorage.app',
  messagingSenderId: '506859726227',
  appId: '1:506859726227:web:9083b07cceca26b8b6b466',
  measurementId: 'G-JJFCRFMBZ9',
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

export const db = getFirestore(app);
export const storage = getStorage(app);
export { app };
