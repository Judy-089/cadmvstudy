import {
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User,
} from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { auth, db, googleProvider } from "./firebase";

export async function signInWithGoogle(): Promise<User | null> {
  if (!auth || !db) {
    console.warn("Firebase not configured. Add your Firebase config to .env.local");
    return null;
  }
  const result = await signInWithPopup(auth, googleProvider);
  const user = result.user;

  const userRef = doc(db, "users", user.uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    await setDoc(userRef, {
      displayName: user.displayName,
      email: user.email,
      photoURL: user.photoURL,
      createdAt: serverTimestamp(),
      lastActiveAt: serverTimestamp(),
      lastModule: null,
      lastSection: null,
      languageMode: "en_zhHans",
      examLanguage: "en",
    });
  } else {
    await setDoc(userRef, { lastActiveAt: serverTimestamp() }, { merge: true });
  }

  return user;
}

export async function signOut(): Promise<void> {
  if (!auth) return;
  await firebaseSignOut(auth);
}

export function onAuthChange(callback: (user: User | null) => void) {
  if (!auth) {
    callback(null);
    return () => {};
  }
  return onAuthStateChanged(auth, callback);
}
