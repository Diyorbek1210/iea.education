import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";

export const firebaseConfig = {
  apiKey: "AIzaSyCC5TBm4rC7AleakQl92W_yRPaiNoGoV9s",

  authDomain: "salom-4f3bd.firebaseapp.com",

  databaseURL: "https://salom-4f3bd-default-rtdb.firebaseio.com",

  projectId: "salom-4f3bd",

  storageBucket: "salom-4f3bd.firebasestorage.app",

  messagingSenderId: "223747081418",

  appId: "1:223747081418:web:5d1d89c7e00cc1a0b82033",

  measurementId: "G-JYXYC0S8DX",
};

export const isFirebaseConfigured = !Object.values(firebaseConfig).some((value) =>
  String(value).startsWith("YOUR_"),
);

let app: FirebaseApp | null = null;
let authInstance: Auth | null = null;
let dbInstance: Firestore | null = null;

if (isFirebaseConfigured) {
  app = getApps().length ? getApp() : initializeApp(firebaseConfig);
  authInstance = getAuth(app);
  dbInstance = getFirestore(app);
}

export const firebaseApp = app;
export const auth = authInstance;
export const db = dbInstance;

export const ADMIN_EMAIL = "diyorbekmuzaffarovich4@gmail.com";
export const ADMIN_PASSWORD = "admin123";
