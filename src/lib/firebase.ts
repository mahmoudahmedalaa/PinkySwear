import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyC8KDQ9oYs7KSHiEhzV9P_5EOG9zBskYys",
    authDomain: "pinkyswear-waitlist-987.firebaseapp.com",
    projectId: "pinkyswear-waitlist-987",
    storageBucket: "pinkyswear-waitlist-987.firebasestorage.app",
    messagingSenderId: "701709778654",
    appId: "1:701709778654:web:ff453713066c15318e8c4f"
};

// Initialize Firebase securely, avoiding multiple instances during Next.js hot reloads.
export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const db = getFirestore(app);
