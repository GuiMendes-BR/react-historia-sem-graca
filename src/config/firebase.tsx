// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA5oLazd_qJsTm7_t_OcL1kLcymOWJ7iuQ",
  authDomain: "historia-sem-graca.firebaseapp.com",
  projectId: "historia-sem-graca",
  storageBucket: "historia-sem-graca.appspot.com",
  messagingSenderId: "359664604213",
  appId: "1:359664604213:web:d6cac907da04b20c80cd7c",
  measurementId: "G-R5QF8ZWDFC",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);
