
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyCVFwDMNN4p0MXzcpJi7amNPOiBPCRDJRQ",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "bellabona-logistic.firebaseapp.com",
  databaseURL: localStorage.getItem('custom_db_url') || import.meta.env.VITE_FIREBASE_DATABASE_URL || "https://bellabona-logistic-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "bellabona-logistic",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "bellabona-logistic.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "347002293332",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:347002293332:web:4afccdc6e6c5690539b1c1"
};

// Initialize Firebase
let app;
try {
  app = initializeApp(firebaseConfig);
  console.log("Firebase App initialized for project:", firebaseConfig.projectId);
} catch (error) {
  console.error("Firebase App initialization failed:", error);
}

// Initialize Realtime Database
let database;
let storageInstance;
if (app) {
  try {
    const dbUrl = firebaseConfig.databaseURL;
    console.log("Connecting to Realtime Database:", dbUrl);
    
    // Explicit URL is mandatory for regional databases
    database = getDatabase(app, dbUrl);
    storageInstance = getStorage(app);
    
    if (database) {
      console.log("Firebase Database instance created.");
    }
    if (storageInstance) {
      console.log("Firebase Storage instance created.");
    }
  } catch (error) {
    console.error("Firebase initialization failed:", error);
  }
}

export const db = database;
export const storage = storageInstance;
export const DB_URL = firebaseConfig.databaseURL;
