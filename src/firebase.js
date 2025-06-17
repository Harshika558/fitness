import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCuuGCnJQ84Mku_0ihkd95ys_hOKMMLXYA",
    authDomain: "dashboard-ca4d6.firebaseapp.com",
    projectId: "dashboard-ca4d6",
    storageBucket: "dashboard-ca4d6.firebasestorage.app",
    messagingSenderId: "251275651056",
    appId: "1:251275651056:web:1d264e9cc992a9663b1f35"
};


// Initialize Firebase 
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);  
export const db = getFirestore(app);
