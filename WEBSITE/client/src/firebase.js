// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "yield-smart-web.firebaseapp.com",
  projectId: "yield-smart-web",
  storageBucket: "yield-smart-web.appspot.com",
  messagingSenderId: "123283112626",
  appId: "1:123283112626:web:c84a21c39515345402bfab"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);