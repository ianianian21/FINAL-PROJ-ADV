/**
 * Date utility functions for task and goal management
 */

/**
 * Format a date to a readable string (e.g., "Mar 15, 2024")
 */
export const formatDate = (date: Date): string => {
  if (!date) return '';
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(date));
};

/**
 * Format a date and time (e.g., "Mar 15, 2024 2:30 PM")
 */
export const formatDateTime = (date: Date): string => {
  if (!date) return '';
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
};

/**
 * Format a date relative to now (e.g., "2 days ago", "in 3 days")
 */
export const formatRelativeDate = (date: Date): string => {
  const now = new Date();
  const diffInMs = new Date(date).getTime() - now.getTime();
  const diffInDays = Math.round(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInDays === 0) return 'Today';
  if (diffInDays === 1) return 'Tomorrow';
  if (diffInDays === -1) return 'Yesterday';
  if (diffInDays > 0) return `in ${diffInDays} days`;
  if (diffInDays < 0) return `${Math.abs(diffInDays)} days ago`;

  return formatDate(date);
};

/**
 * Check if a date is today
 */
export const isToday = (date: Date): boolean => {
  const today = new Date();
  const checkDate = new Date(date);
  return (
    today.getFullYear() === checkDate.getFullYear() &&
    today.getMonth() === checkDate.getMonth() &&
    today.getDate() === checkDate.getDate()
  );
};

/**
 * Check if a date is in the past
 */
export const isPast = (date: Date): boolean => {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const checkDate = new Date(date);
  checkDate.setHours(0, 0, 0, 0);
  return checkDate < now;
};

/**
 * Check if a date is overdue (past and not completed)
 */
export const isOverdue = (dueDate: Date | null, completed: boolean): boolean => {
  if (!dueDate || completed) return false;
  return isPast(dueDate);
};

/**
 * Get the start of today (00:00:00)
 */
export const getStartOfToday = (): Date => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
};

/**
 * Get the end of today (23:59:59)
 */
export const getEndOfToday = (): Date => {
  const today = new Date();
  today.setHours(23, 59, 59, 999);
  return today;
};

/**
 * Get the start of a specific date
 */
export const getStartOfDate = (date: Date): Date => {
  const newDate = new Date(date);
  newDate.setHours(0, 0, 0, 0);
  return newDate;
};

/**
 * Get the end of a specific date
 */
export const getEndOfDate = (date: Date): Date => {
  const newDate = new Date(date);
  newDate.setHours(23, 59, 59, 999);
  return newDate;
};

/**
 * Get date N days from now
 */
export const addDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

/**
 * Get date N weeks from now
 */
export const addWeeks = (date: Date, weeks: number): Date => {
  return addDays(date, weeks * 7);
};

/**
 * Get date N months from now
 */
export const addMonths = (date: Date, months: number): Date => {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
};

/**
 * Get the start of the week (Monday)
 */
export const getStartOfWeek = (date: Date): Date => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
  return new Date(d.setDate(diff));
};

/**
 * Get all dates in a range (inclusive)
 */
export const getDateRange = (startDate: Date, endDate: Date): Date[] => {
  const dates: Date[] = [];
  const currentDate = new Date(getStartOfDate(startDate));
  const finalDate = new Date(getEndOfDate(endDate));

  while (currentDate <= finalDate) {
    dates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
};
