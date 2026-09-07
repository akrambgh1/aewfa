import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// A separate, uniquely-named Firebase app instance so this doesn't collide
// with any Firebase setup your main site might already have.
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const DASHBOARD_APP_NAME = "dashboard";

const app = getApps().some((a) => a.name === DASHBOARD_APP_NAME)
  ? getApp(DASHBOARD_APP_NAME)
  : initializeApp(firebaseConfig, DASHBOARD_APP_NAME);

export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
