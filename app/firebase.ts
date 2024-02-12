import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

// Dev
// const firebaseConfig = {
//   apiKey: "AIzaSyBYBjoyBEoeXFGKEMR2wbuxKe1fuVc7IEQ",
//   authDomain: "pragmatica-test.firebaseapp.com",
//   databaseURL: "https://pragmatica-test-default-rtdb.firebaseio.com",
//   projectId: "pragmatica-test",
//   storageBucket: "pragmatica-test.appspot.com",
//   messagingSenderId: "326378839447",
//   appId: "1:326378839447:web:d93cc1fb3da43f34b738d2"
// };

// Prod
const firebaseConfig = {
  apiKey: "AIzaSyAzYUr54l918JEfa-95dSnMQYazV8r-u9c",
  authDomain: "pragmaticaprod.firebaseapp.com",
  databaseURL: "https://pragmaticaprod-default-rtdb.firebaseio.com",
  projectId: "pragmaticaprod",
  storageBucket: "pragmaticaprod.appspot.com",
  messagingSenderId: "600320261773",
  appId: "1:600320261773:web:1883ddfe3a60e43243ecc4",
  measurementId: "G-DT43XL2TCY"
};

const firebaseApp = initializeApp(firebaseConfig);
const firebaseAuth = getAuth(firebaseApp);
const database = getDatabase(firebaseApp);

export { firebaseApp, firebaseAuth, database };