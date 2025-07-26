import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
// ✅ Sirf typing ke liye
import type { User } from "firebase/auth";

import {
  getFirestore,
  setDoc,
  getDoc,
  doc,
  updateDoc,
  deleteDoc,
  addDoc,
  collection,
} from "firebase/firestore";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAGGThSyXIqygy4RVy5ANyY09v8QhU0s8U",
  authDomain: "nasr-ul-islam.firebaseapp.com",
  projectId: "nasr-ul-islam",
  storageBucket: "nasr-ul-islam.firebasestorage.app",
  messagingSenderId: "949925523893",
  appId: "1:949925523893:web:39366c7cd84c3f5be4a9fc",
  measurementId: "G-MWKBBJGRW6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firebase Services
export const auth = getAuth(app);
export const db = getFirestore(app);


// Export Firebase Auth and Firestore functions (without `User`)
export {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  setDoc,
  getDoc,
  doc,
  updateDoc,
  deleteDoc,
  addDoc,
  collection,
};

// ✅ Type export ka alag tarika
export type { User };
