/**
 * useTheme Hook
 * Returns the appropriate theme colors based on the user's preference
 * 
 * Usage:
 * const theme = useTheme();
 * 
 * Then use theme.background, theme.text, etc. instead of LIGHT_THEME
 */

import { useAppContext } from './useAppContext';
import { LIGHT_THEME, DARK_THEME } from '../constants/colors';

export const useTheme = () => {
  const { user } = useAppContext();
  return user?.theme === 'dark' ? DARK_THEME : LIGHT_THEME;
};
