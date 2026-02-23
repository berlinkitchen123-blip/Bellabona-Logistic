
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyCVFwDMNN4p0MXzcpJi7amNPOiBPCRDJRQ",
  authDomain: "bellabona-logistic.firebaseapp.com",
  databaseURL: "https://bellabona-logistic-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "bellabona-logistic",
  storageBucket: "bellabona-logistic.firebasestorage.app",
  messagingSenderId: "347002293332",
  appId: "1:347002293332:web:4afccdc6e6c5690539b1c1"
};

// Initialize Firebase
let app;
try {
  app = initializeApp(firebaseConfig);
  console.log("Firebase App initialized:", firebaseConfig.projectId);
} catch (error) {
  console.error("Firebase App initialization failed:", error);
}

// Initialize Realtime Database
let database;
if (app) {
  try {
    const dbUrl = firebaseConfig.databaseURL;
    console.log("Attempting to connect to Firebase RTDB at:", dbUrl);
    
    // Passing the URL explicitly is required for regional databases (europe-west1)
    database = getDatabase(app, dbUrl);
    
    if (database) {
      console.log("Firebase Database object created successfully.");
    }
  } catch (error) {
    console.error("Firebase Database initialization failed:", error);
  }
}

export const db = database;
