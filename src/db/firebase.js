// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth,GoogleAuthProvider,FacebookAuthProvider } from "firebase/auth";
const firebaseConfig = {
  apiKey: "AIzaSyCiIySSjAxPFPaigTqZAogd89wzziHuOCM",
  authDomain: "santibook-25393.firebaseapp.com",
  projectId: "santibook-25393",
  storageBucket: "santibook-25393.firebasestorage.app",
  messagingSenderId: "1084456538189",
  appId: "1:1084456538189:web:19f255247d23918667cc04",
  measurementId: "G-0LCBW3QFBW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

//auth
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const facebookProvider = new FacebookAuthProvider();