import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyBYBjoyBEoeXFGKEMR2wbuxKe1fuVc7IEQ",
  authDomain: "pragmatica-test.firebaseapp.com",
  databaseURL: "https://pragmatica-test-default-rtdb.firebaseio.com",
  projectId: "pragmatica-test",
  storageBucket: "pragmatica-test.appspot.com",
  messagingSenderId: "326378839447",
  appId: "1:326378839447:web:d93cc1fb3da43f34b738d2"
};

const firebaseApp = initializeApp(firebaseConfig);
const firebaseAuth = getAuth(firebaseApp);
const database = getDatabase(firebaseApp);

export { firebaseApp, firebaseAuth, database };