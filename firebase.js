// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBrgAVReJcv37N6217ZDY7yG1-iLzrDenM",
  authDomain: "inventory-management-2cf4e.firebaseapp.com",
  projectId: "inventory-management-2cf4e",
  storageBucket: "inventory-management-2cf4e.appspot.com",
  messagingSenderId: "1050762338752",
  appId: "1:1050762338752:web:7f4caa955b5c63aa6f6825",
  measurementId: "G-YQ6H4NDWQW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app)

export{firestore}
