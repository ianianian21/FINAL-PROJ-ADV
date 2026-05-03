/**
 * App constants: categories, spacing, border radius, etc.
 */

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  '2xl': 32,
};

export const BORDER_RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 9999,
};

export const TASK_CATEGORIES = [
  'Work',
  'Personal',
  'Shopping',
  'Health',
  'Learning',
  'Other',
];

export const GOAL_CATEGORIES = [
  'Exercise',
  'Nutrition',
  'Study',
  'Personal',
  'Health',
  'Finance',
  'Learning',
];

export const GOAL_DISPLAY_TYPES = [
  { value: 'gauge' as const, label: 'Gauge' },
  { value: 'bar' as const, label: 'Progress Bar' },
  { value: 'kpi' as const, label: 'KPI' },
];

export const GOAL_ICONS = [
  'dumbbell',
  'apple',
  'book',
  'heart',
  'zap',
  'target',
  'flag',
  'star',
  'award',
  'trending-up',
];

export const PRIORITY_LEVELS = [
  { value: 'low' as const, label: 'Low', description: 'Can wait' },
  { value: 'medium' as const, label: 'Medium', description: 'Normal priority' },
  { value: 'high' as const, label: 'High', description: 'Important' },
];

export const ACCENT_COLORS = [
  { name: 'Teal', value: '#4A9D9E' },
  { name: 'Yellow', value: '#E8C547' },
  { name: 'Purple', value: '#9B8FB3' },
  { name: 'Orange', value: '#D89456' },
  { name: 'Green', value: '#7FB069' },
  { name: 'Blue', value: '#6B9EBE' },
  { name: 'Pink', value: '#C89B9B' },
];

// Duration for animations and transitions (in milliseconds)
export const ANIMATION_DURATION = {
  fast: 150,
  normal: 300,
  slow: 500,
};

// HTTP/Network constants
export const API_TIMEOUT = 30000; // 30 seconds

// Storage keys for AsyncStorage
export const STORAGE_KEYS = {
  USER_THEME: '@taskly_user_theme',
  LAST_SYNC: '@taskly_last_sync',
};
