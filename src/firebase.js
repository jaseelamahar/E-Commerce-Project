import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCIs3Rj12he-rqoIrvQdRZLpyA05oa8Nwc",
  authDomain: "shoppy-website-553ef.firebaseapp.com",
  projectId: "shoppy-website-553ef",
  storageBucket: "shoppy-website-553ef.firebasestorage.app",
  messagingSenderId: "301977490134",
  appId: "1:301977490134:web:59d5617534dae15c212f77",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

