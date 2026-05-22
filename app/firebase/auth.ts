/**
 * Firebase Authentication service
 * Handles user registration, login, logout, and password reset
 */

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  setPersistence,
  browserSessionPersistence,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from './config';
import { User } from '../types';

/**
 * Register a new user with email and password
 * Also creates a user profile document in Firestore
 * 
 * @param email - User email
 * @param password - User password (must be 6+ characters)
 * @param displayName - User's display name
 * @throws Error if registration fails
 */
export const registerUser = async (
  email: string,
  password: string,
  displayName: string
): Promise<User> => {
  try {
    // Create authentication user
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const uid = userCredential.user.uid;

    // Create user profile document in Firestore
    const userDoc: User = {
      uid,
      email,
      displayName,
      createdAt: new Date(),
      theme: 'light',
    };

    await setDoc(doc(db, 'users', uid), userDoc);

    return userDoc;
  } catch (error: any) {
    // Provide user-friendly error messages
    if (error.code === 'auth/email-already-in-use') {
      throw new Error('This email is already registered');
    }
    if (error.code === 'auth/weak-password') {
      throw new Error('Password is too weak. Use at least 6 characters.');
    }
    if (error.code === 'auth/invalid-email') {
      throw new Error('Invalid email address');
    }
    throw new Error(error.message || 'Failed to register user');
  }
};

/**
 * Sign in an existing user with email and password
 * 
 * @param email - User email
 * @param password - User password
 * @throws Error if login fails
 */
export const loginUser = async (email: string, password: string): Promise<void> => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (error: any) {
    // Provide user-friendly error messages
    if (error.code === 'auth/user-not-found') {
      throw new Error('No account found with this email');
    }
    if (error.code === 'auth/wrong-password') {
      throw new Error('Incorrect password');
    }
    if (error.code === 'auth/invalid-email') {
      throw new Error('Invalid email address');
    }
    if (error.code === 'auth/user-disabled') {
      throw new Error('This account has been disabled');
    }
    throw new Error(error.message || 'Failed to sign in');
  }
};

/**
 * Sign out the current user
 */
export const logoutUser = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error: any) {
    throw new Error(error.message || 'Failed to sign out');
  }
};

/**
 * Send password reset email to user
 * @param email - User email to send reset link to
 * @throws Error if reset fails
 */
export const resetPassword = async (email: string): Promise<void> => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error: any) {
    if (error.code === 'auth/user-not-found') {
      throw new Error('No account found with this email');
    }
    if (error.code === 'auth/invalid-email') {
      throw new Error('Invalid email address');
    }
    throw new Error(error.message || 'Failed to send reset email');
  }
};

/**
 * Get the current user's UID
 * Used for scoping Firestore queries to the current user
 */
export const getCurrentUserId = (): string | null => {
  return auth.currentUser?.uid || null;
};

/**
 * Check if a user is currently authenticated
 */
export const isUserAuthenticated = (): boolean => {
  return auth.currentUser !== null;
};