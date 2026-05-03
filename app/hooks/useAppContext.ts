/**
 * useAppContext Hook
 * Custom hook to access the authentication context throughout the app
 * 
 * Usage:
 * const { user, loading, signIn } = useAppContext();
 */

import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { AuthContextType } from '../types';

export const useAppContext = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error(
      'useAppContext must be used within an AuthProvider. ' +
      'Make sure your component is wrapped with <AuthProvider>'
    );
  }
  return context;
};
