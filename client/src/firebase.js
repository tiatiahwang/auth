// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: 'auth-7cf32.firebaseapp.com',
  projectId: 'auth-7cf32',
  storageBucket: 'auth-7cf32.appspot.com',
  messagingSenderId: '732870947854',
  appId: '1:732870947854:web:2a5d65d0d05a06fcf6f85f',
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
