
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCVFwDMNN4p0MXzcpJi7amNPOiBPCRDJRQ",
  authDomain: "bellabona-logistic.firebaseapp.com",
  databaseURL: "https://bellabona-logistic-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "bellabona-logistic",
  storageBucket: "bellabona-logistic.firebasestorage.app",
  messagingSenderId: "347002293332",
  appId: "1:347002293332:web:4afccdc6e6c5690539b1c1"
};

const app = initializeApp(firebaseConfig);

export const db = getDatabase(app);
export const storage = getStorage(app);
export const DB_URL = firebaseConfig.databaseURL;
