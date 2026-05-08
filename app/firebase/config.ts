/**
 * Firebase configuration
 * Initialize Firebase with credentials from environment variables
 * 
 * IMPORTANT: Never commit .env to git. These keys are public but the .env should be
 * in .gitignore to prevent accidental exposure of your Firebase project ID.
 */

import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDCTVpGUp4nqhKfJNbzy-5UGUEbqzVGgvU",
  authDomain: "taskly-4e827.firebaseapp.com",
  projectId: "taskly-4e827",
  storageBucket: "taskly-4e827.firebasestorage.app",
  messagingSenderId: "709427378525",
  appId: "1:709427378525:web:f0ebc3f90ba3bc737c90b4",
  measurementId: "G-ZWXYNT4FHZ"
};

// Validate that all required config values are present
const requiredConfigKeys = [
  'apiKey',
  'authDomain',
  'projectId',
  'storageBucket',
  'messagingSenderId',
  'appId',
];

const missingKeys = requiredConfigKeys.filter(
  (key) => !firebaseConfig[key as keyof typeof firebaseConfig]
);

if (missingKeys.length > 0) {
  console.error(
    `Firebase config is missing required keys: ${missingKeys.join(', ')}. 
     Make sure your .env file contains all EXPO_PUBLIC_FIREBASE_* variables.`
  );
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth with platform-specific persistence
// On React Native: uses AsyncStorage
// On Web: uses default persistence (localStorage)
let auth;
if (typeof window === 'undefined') {
  // React Native environment
  const ReactNativeAsyncStorage = require('@react-native-async-storage/async-storage').default;
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
  });
} else {
  // Web environment - use default Firebase persistence
  auth = initializeAuth(app);
}

export { auth };
export const db = getFirestore(app);

export default app;