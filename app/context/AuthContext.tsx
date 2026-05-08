/**
 * Authentication Context
 * Manages user authentication state and provides auth methods throughout the app
 * 
 * This context wraps the Firebase authentication and provides a clean interface
 * for screens to access the current user and auth methods.
 */

import React, { createContext, useEffect, useState, useCallback } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth } from '../firebase/config';
import {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUserId,
} from '../firebase/auth';
import { getUserProfile, updateUserTheme } from '../firebase/firestore';
import { AuthContextType, User } from '../types';
import { STORAGE_KEYS } from '../constants/theme';

// Create the context with an undefined initial value
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

/**
 * AuthProvider component
 * Wraps the app and provides authentication context to all screens
 * 
 * Handles:
 * - Firebase authentication state persistence
 * - User profile loading from Firestore
 * - Sign up, sign in, and sign out operations
 * - Theme preference management
 */
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Listen for auth state changes
   * When user logs in/out, Firebase emits an event and we fetch their profile
   */
  useEffect(() => {
    let isMounted = true;
    let loadingTimeout: ReturnType<typeof setTimeout>;

    // Set a timeout to prevent infinite loading (max 10 seconds)
    const setLoadingTimeout = () => {
      loadingTimeout = setTimeout(() => {
        if (isMounted && loading) {
          console.warn('Loading timeout - setting to false');
          setLoading(false);
        }
      }, 10000);
    };

    setLoadingTimeout();

    // Subscribe to auth state changes
    // This is called whenever user signs in/out
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!isMounted) return;

      try {
        if (firebaseUser) {
          // User is logged in - fetch their profile from Firestore
          try {
            const profile = await getUserProfile(firebaseUser.uid);
            if (profile && isMounted) {
              setUser(profile);
              // Load their theme preference
              const savedTheme = await AsyncStorage.getItem(STORAGE_KEYS.USER_THEME);
              if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark') && isMounted) {
                setUser((prev) => (prev ? { ...prev, theme: savedTheme } : prev));
              }
            } else if (isMounted) {
              // Profile doesn't exist, create a basic user object from Firebase user
              const basicUser: User = {
                uid: firebaseUser.uid,
                email: firebaseUser.email || '',
                displayName: firebaseUser.displayName || 'User',
                createdAt: new Date(),
                theme: 'light',
              };
              setUser(basicUser);
            }
          } catch (profileErr: any) {
            console.warn('Failed to fetch profile, using basic user:', profileErr.message);
            if (isMounted) {
              // Fallback: create basic user even if profile fetch fails
              const basicUser: User = {
                uid: firebaseUser.uid,
                email: firebaseUser.email || '',
                displayName: firebaseUser.displayName || 'User',
                createdAt: new Date(),
                theme: 'light',
              };
              setUser(basicUser);
            }
          }
        } else {
          // User is logged out
          if (isMounted) {
            setUser(null);
          }
        }
      } catch (err: any) {
        console.error('Error in auth state change:', err);
        if (isMounted) {
          setError(err.message);
          setUser(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
          clearTimeout(loadingTimeout);
        }
      }
    });

    // Cleanup subscription on unmount
    return () => {
      isMounted = false;
      clearTimeout(loadingTimeout);
      unsubscribe();
    };
  }, []);

  /**
   * Handle user sign up
   */
  const signUp = useCallback(
    async (email: string, password: string, displayName: string) => {
      try {
        setError(null);
        setLoading(true);
        await registerUser(email, password, displayName);
        // onAuthStateChanged listener will handle setting user and loading state
      } catch (err: any) {
        const errorMessage = err.message || 'Sign up failed';
        setError(errorMessage);
        setLoading(false);
        throw err;
      }
    },
    []
  );

  /**
   * Handle user sign in
   */
  const signIn = useCallback(async (email: string, password: string) => {
    try {
      setError(null);
      setLoading(true);
      await loginUser(email, password);
      // onAuthStateChanged listener will handle setting user and loading state
    } catch (err: any) {
      const errorMessage = err.message || 'Sign in failed';
      setError(errorMessage);
      setLoading(false);
      throw err;
    }
  }, []);

  /**
   * Handle user sign out
   */
  const signOut = useCallback(async () => {
    try {
      setError(null);
      setLoading(true);
      await logoutUser();
      await AsyncStorage.removeItem(STORAGE_KEYS.USER_THEME);
      // onAuthStateChanged listener will handle setting user to null and loading state
    } catch (err: any) {
      const errorMessage = err.message || 'Sign out failed';
      setError(errorMessage);
      setLoading(false);
      throw err;
    }
  }, []);

  /**
   * Toggle between light and dark theme
   */
  const toggleTheme = useCallback(async () => {
    try {
      if (!user) throw new Error('No user logged in');

      const newTheme = user.theme === 'light' ? 'dark' : 'light';

      // Update in Firestore
      const userId = getCurrentUserId();
      if (userId) {
        await updateUserTheme(userId, newTheme);
      }

      // Update local state
      setUser((prev) => (prev ? { ...prev, theme: newTheme } : null));

      // Save preference to device storage
      await AsyncStorage.setItem(STORAGE_KEYS.USER_THEME, newTheme);
    } catch (err: any) {
      console.error('Error toggling theme:', err);
      setError(err.message);
      throw err;
    }
  }, [user]);

  /**
   * Refresh user profile from Firestore
   */
  const refreshUser = useCallback(async () => {
    try {
      const userId = getCurrentUserId();
      if (userId) {
        const profile = await getUserProfile(userId);
        if (profile) {
          setUser(profile);
        }
      }
    } catch (err: any) {
      console.error('Error refreshing user:', err);
    }
  }, []);

  const value: AuthContextType = {
    user,
    loading,
    signUp,
    signIn,
    signOut,
    toggleTheme,
    refreshUser,
    error,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Hook to use the auth context
 * Usage: const { user, loading, signIn } = useAppContext();
 */
export const useAppContext = (): AuthContextType => {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AuthProvider');
  }
  return context;
};
