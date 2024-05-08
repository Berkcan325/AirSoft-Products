import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAsdgrwtGcfJ6fQ2QbDnhxU7JsWu1pevP0",
  authDomain: "airsoftguns-34fbf.firebaseapp.com",
  projectId: "airsoftguns-34fbf",
  storageBucket: "airsoftguns-34fbf.appspot.com",
  messagingSenderId: "935439732152",
  appId: "1:935439732152:web:22df428269b8a433a4534d",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
