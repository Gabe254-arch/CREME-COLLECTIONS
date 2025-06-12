import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

// ✅ Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyA9x1hh9SLOBgA2L2PVCfp_QiGhN3qGZPA",
  authDomain: "cremecollections-d9c3c.firebaseapp.com",
  projectId: "cremecollections-d9c3c",
  storageBucket: "cremecollections-d9c3c.appspot.com",
  messagingSenderId: "479996765755",
  appId: "1:479996765755:web:41bede125cd1f708859e1e",
  measurementId: "G-1437HHFHZX"
};

// ✅ Initialize Firebase App
const app = initializeApp(firebaseConfig);

// ✅ Export what you need for authentication
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
