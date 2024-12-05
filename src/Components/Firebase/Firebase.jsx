import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Your Firebase config object
const firebaseConfig = {
    apiKey: "AIzaSyBErgDnr8rGD3zUhyM8zhI42o31Y5WEWp8",
    authDomain: "gps-tracking-fb470.firebaseapp.com",
    projectId: "gps-tracking-fb470",
    storageBucket: "gps-tracking-fb470.firebasestorage.app",
    messagingSenderId: "251702924213",
    appId: "1:251702924213:web:6265b12fefee554b33bffc",
    measurementId: "G-55RGNF0LHZ"
  };

  const app = initializeApp(firebaseConfig);

  // Initialize Firestore
  const db = getFirestore(app);
  
  export { db };
