/**
 * Light theme color palette for Taskly
 * iOS-style, minimalistic design with soft accent colors
 */

export const LIGHT_THEME = {
  // Primary backgrounds
  background: '#FFFFFF',
  backgroundSecondary: '#F8F8F8',
  backgroundTertiary: '#F0F0F0',

  // Text colors
  text: '#1C1C1C',
  textSecondary: '#666666',
  textTertiary: '#999999',
  textInverse: '#FFFFFF',

  // Accent colors - soft and muted
  accentTeal: '#4A9D9E',        // Soft teal
  accentYellow: '#E8C547',      // Warm yellow
  accentPurple: '#9B8FB3',      // Muted purple
  accentOrange: '#D89456',      // Soft orange
  accentGreen: '#7FB069',       // Natural green
  accentBlue: '#6B9EBE',        // Muted blue
  accentPink: '#C89B9B',        // Muted pink

  // Status colors
  success: '#4CAF50',
  warning: '#FFC107',
  error: '#F44336',
  info: '#2196F3',

  // Neutral grays
  border: '#E0E0E0',
  borderLight: '#F0F0F0',
  disabled: '#CCCCCC',
  overlay: 'rgba(0, 0, 0, 0.3)',

  // Task priority colors
  priorityLow: '#7FB069',       // Green
  priorityMedium: '#E8C547',    // Yellow
  priorityHigh: '#D89456',      // Orange

  // Shadow
  shadow: 'rgba(0, 0, 0, 0.1)',
  shadowMedium: 'rgba(0, 0, 0, 0.15)',
};

export const DARK_THEME = {
  background: '#1C1C1C',
  backgroundSecondary: '#2D2D2D',
  backgroundTertiary: '#3A3A3A',

  text: '#FFFFFF',
  textSecondary: '#CCCCCC',
  textTertiary: '#999999',
  textInverse: '#1C1C1C',

  accentTeal: '#4A9D9E',
  accentYellow: '#E8C547',
  accentPurple: '#9B8FB3',
  accentOrange: '#D89456',
  accentGreen: '#7FB069',
  accentBlue: '#6B9EBE',
  accentPink: '#C89B9B',

  success: '#4CAF50',
  warning: '#FFC107',
  error: '#F44336',
  info: '#2196F3',

  border: '#404040',
  borderLight: '#353535',
  disabled: '#555555',
  overlay: 'rgba(0, 0, 0, 0.5)',

  priorityLow: '#7FB069',
  priorityMedium: '#E8C547',
  priorityHigh: '#D89456',

  shadow: 'rgba(0, 0, 0, 0.3)',
  shadowMedium: 'rgba(0, 0, 0, 0.4)',
};

export type Theme = typeof LIGHT_THEME;
