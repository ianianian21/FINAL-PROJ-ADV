/**
 * Form validation utilities
 */

export interface ValidationError {
  [key: string]: string;
}

/**
 * Validate email format
 */
export const validateEmail = (email: string): string | null => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) return 'Email is required';
  if (!emailRegex.test(email)) return 'Please enter a valid email';
  return null;
};

/**
 * Validate password strength
 * Requirements: at least 6 characters, at least one letter, at least one number
 */
export const validatePassword = (password: string): string | null => {
  if (!password) return 'Password is required';
  if (password.length < 6) return 'Password must be at least 6 characters';
  if (!/[a-zA-Z]/.test(password)) return 'Password must contain at least one letter';
  if (!/\d/.test(password)) return 'Password must contain at least one number';
  return null;
};

/**
 * Validate password confirmation
 */
export const validatePasswordMatch = (password: string, confirmPassword: string): string | null => {
  if (password !== confirmPassword) return 'Passwords do not match';
  return null;
};

/**
 * Validate task title
 */
export const validateTaskTitle = (title: string): string | null => {
  if (!title) return 'Task title is required';
  if (title.trim().length === 0) return 'Task title cannot be empty';
  if (title.length > 100) return 'Task title must be less than 100 characters';
  return null;
};

/**
 * Validate goal title
 */
export const validateGoalTitle = (title: string): string | null => {
  if (!title) return 'Goal title is required';
  if (title.trim().length === 0) return 'Goal title cannot be empty';
  if (title.length > 100) return 'Goal title must be less than 100 characters';
  return null;
};

/**
 * Validate numeric value
 */
export const validateNumber = (value: string | number): string | null => {
  if (value === '' || value === null) return 'Value is required';
  const num = Number(value);
  if (isNaN(num)) return 'Must be a valid number';
  if (num <= 0) return 'Must be greater than 0';
  return null;
};

/**
 * Validate due date
 */
export const validateDueDate = (dueDate: Date | null): string | null => {
  if (!dueDate) return null; // Due date is optional
  if (dueDate < new Date()) return 'Due date cannot be in the past';
  return null;
};

/**
 * Check if form has errors
 */
export const hasErrors = (errors: ValidationError): boolean => {
  return Object.values(errors).some((error) => error !== null && error !== '');
};

/**
 * Clear errors for a specific field
 */
export const clearError = (errors: ValidationError, fieldName: string): ValidationError => {
  return {
    ...errors,
    [fieldName]: '',
  };
};

/**
 * Set error for a specific field
 */
export const setError = (errors: ValidationError, fieldName: string, error: string | null): ValidationError => {
  return {
    ...errors,
    [fieldName]: error || '',
  };
};

/**
 * Clear all errors
 */
export const clearAllErrors = (errors: ValidationError): ValidationError => {
  const cleared: ValidationError = {};
  Object.keys(errors).forEach((key) => {
    cleared[key] = '';
  });
  return cleared;
};
