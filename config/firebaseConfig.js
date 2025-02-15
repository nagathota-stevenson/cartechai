import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDsm-_zhMcZWF7QYCLAxliHzbCHY6R1Hlk",
  authDomain: "cartechai.firebaseapp.com",
  projectId: "cartechai",
  storageBucket: "cartechai.firebasestorage.app",
  messagingSenderId: "631048456486",
  appId: "1:631048456486:web:200f169a916e21ef53d9e7",
  measurementId: "G-8FNE17BKV3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = getAuth(app);