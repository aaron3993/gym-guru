import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getAnalytics, logEvent } from "firebase/analytics";
import "firebase/firestore";

const environment = process.env.NODE_ENV || "production";

const firebaseConfig =
  environment === "production"
    ? {
        apiKey: "AIzaSyAS4_3SkAK1nz-x3RGeszlX-BxPZt_0BsQ",
        authDomain: "gymguru-37ed9.firebaseapp.com",
        projectId: "gymguru-37ed9",
        storageBucket: "gymguru-37ed9.appspot.com",
        messagingSenderId: "586710732433",
        appId: "1:586710732433:web:ee2bb9cef1d3af75fd3930",
        measurementId: "G-3QB6JVYJS5",
      }
    : {
        apiKey: "AIzaSyCnwF_xUgPgfoyQ4lw46Q31OnnJOwN3p9U",
        authDomain: "gym-guru-staging.firebaseapp.com",
        projectId: "gym-guru-staging",
        storageBucket: "gym-guru-staging.appspot.com",
        messagingSenderId: "304940808094",
        appId: "1:304940808094:web:72cf821435d2a304f1088f",
        measurementId: "G-NLV7ZDK4X0",
      };

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const analytics = getAnalytics(app);

export { app, db, auth, logEvent, analytics };
