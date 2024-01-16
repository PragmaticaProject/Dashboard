import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyBBkSVo40-RVqesSULwMH8ZCo09oZk4d34",
  authDomain: "pragmatica-kptm2023.firebaseapp.com",
  databaseURL: "https://pragmatica-kptm2023-default-rtdb.firebaseio.com",
  projectId: "pragmatica-kptm2023",
  storageBucket: "pragmatica-kptm2023.appspot.com",
  messagingSenderId: "669124584665",
  appId: "1:669124584665:web:de70c09ff8c86a359b0ac8"
};

const firebaseApp = initializeApp(firebaseConfig);
const firebaseAuth = getAuth(firebaseApp);
const database = getDatabase(firebaseApp);

export { firebaseApp, firebaseAuth, database };