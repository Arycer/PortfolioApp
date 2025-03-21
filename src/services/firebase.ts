import {initializeApp, FirebaseOptions, FirebaseApp} from "firebase/app";
import {getFirestore, Firestore} from "firebase/firestore";
import {getAuth, Auth} from "firebase/auth";

const firebaseConfig: FirebaseOptions = {
    apiKey: "AIzaSyCJrRp6cnCPF1ElPQ2tc6n4KrkuekvkC_g",
    authDomain: "arycerportfolio.firebaseapp.com",
    projectId: "arycerportfolio",
    storageBucket: "arycerportfolio.firebasestorage.app",
    messagingSenderId: "1093711433138",
    appId: "1:1093711433138:web:84cd3b7cfd12db9923e8ab",
    measurementId: "G-3BX899DT3E"
};

const app: FirebaseApp = initializeApp(firebaseConfig);

export const db: Firestore = getFirestore(app);
export const auth: Auth = getAuth(app);
