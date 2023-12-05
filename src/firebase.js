import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAS4_3SkAK1nz-x3RGeszlX-BxPZt_0BsQ",
  authDomain: "gymguru-37ed9.firebaseapp.com",
  projectId: "gymguru-37ed9",
  storageBucket: "gymguru-37ed9.appspot.com",
  messagingSenderId: "586710732433",
  appId: "1:586710732433:web:ee2bb9cef1d3af75fd3930",
  measurementId: "G-3QB6JVYJS5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

export { app, db, auth };