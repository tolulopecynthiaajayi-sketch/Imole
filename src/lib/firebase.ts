import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'imole-energy-pilot',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '1:1082846929996:web:20c8944266284ff07500e9',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'imole-energy-pilot.firebasestorage.app',
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'AIzaSyAuCziEenAK7FOBXV4_i5Qs4v2J2HaiYRQ',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'imole-energy-pilot.firebaseapp.com',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '1082846929996',
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const clientDb = getFirestore(app);
