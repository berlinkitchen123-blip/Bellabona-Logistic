
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
const app = initializeApp(firebaseConfig);

// Initialize Realtime Database and get a reference to the service.
// We explicitly pass the databaseURL to ensure the SDK uses the correct regional endpoint.
// This is critical for databases hosted in non-default regions like europe-west1.
export const db = getDatabase(app, firebaseConfig.databaseURL);
