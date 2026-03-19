import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBI2pHqIKd_Uz0Rb3xJ2YH_IzhkKb7aRbM",
  authDomain: "petbuddy-138.firebaseapp.com",
  databaseURL: "https://petbuddy-138-default-rtdb.firebaseio.com",
  projectId: "petbuddy-138",
  storageBucket: "petbuddy-138.firebasestorage.app",
  messagingSenderId: "506859726227",
  appId: "1:506859726227:web:9083b07cceca26b8b6b466",
  measurementId: "G-JJFCRFMBZ9",
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export { app, analytics };
