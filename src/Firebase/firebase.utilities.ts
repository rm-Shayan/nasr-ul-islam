// firebaseUtils.ts
import {
  auth,
  db,
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
} from "./Firebase";

import type { User,Auth } from "firebase/auth";
import type { DocumentData } from "firebase/firestore";

// 🔐 AUTH FUNCTIONS

export const signUp = (email: string, password: string) =>
  createUserWithEmailAndPassword(auth, email, password);

export const login = (email: string, password: string) =>
  signInWithEmailAndPassword(auth, email, password);

export const loginWithGoogle = () => {
  const provider = new GoogleAuthProvider();
  return signInWithPopup(auth, provider);
};


export const logout = async (auth: Auth): Promise<boolean> => {
  try {
    await signOut(auth);
    return true;
  } catch (error) {
    console.error("Logout failed:", error);
    return false;
  }
};




export const listenToAuthChanges = (
  callback: (user: User | null) => void
) => onAuthStateChanged(auth, callback);


// 🧾 USER DOC HELPERS

export const createUserDoc = async (user: User) => {
  if (!user) return;

  const userRef = doc(db, "users", user.uid);
  const snapshot = await getDoc(userRef);

  if (!snapshot.exists()) {
    await setDoc(userRef, {
      name: user.displayName || "No Name",
      email: user.email,
      photoURL: user.photoURL,
      createdAt: new Date().toISOString(),
    });
  }
};
export const getUserDoc = (uid: string) =>
  getDoc(doc(db, "users", uid));

export const updateUserDoc = (uid: string, data: Partial<DocumentData>) =>
  updateDoc(doc(db, "users", uid), data);

export const deleteUserDoc = (uid: string) =>
  deleteDoc(doc(db, "users", uid));

export const addNewDocToCollection = (col: string, data: DocumentData) =>
  addDoc(collection(db, col), data);
