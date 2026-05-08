/**
 * Central TypeScript type definitions for the Taskly app
 * These are shared across all screens and components
 */

// ============================================================================
// USER TYPES
// ============================================================================

export interface User {
  uid: string;
  email: string;
  displayName: string;
  profilePicture?: string;
  createdAt: Date;
  theme: 'light' | 'dark';
}

// ============================================================================
// TASK TYPES
// ============================================================================

export type TaskPriority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  dueDate: Date | null;
  priority: TaskPriority;
  category: string;
  color: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TaskInput {
  title: string;
  description: string;
  dueDate: Date | null;
  priority: TaskPriority;
  category: string;
  color: string;
}

// ============================================================================
// GOAL TYPES
// ============================================================================

export type GoalDisplayType = 'gauge' | 'bar' | 'kpi';
export type GoalCategory = 'Exercise' | 'Nutrition' | 'Study' | 'Personal' | 'Health' | 'Finance' | 'Learning';

export interface Goal {
  id: string;
  title: string;
  category: GoalCategory;
  targetValue: number;
  unit: string;
  currentValue: number;
  color: string;
  icon: string;
  displayType: GoalDisplayType;
  createdAt: Date;
  updatedAt: Date;
}

export interface GoalProgress {
  id: string;
  value: number;
  date: Date;
  notes?: string;
}

export interface GoalInput {
  title: string;
  category: GoalCategory;
  targetValue: number;
  unit: string;
  color: string;
  icon: string;
  displayType: GoalDisplayType;
}

// ============================================================================
// AUTH CONTEXT TYPES
// ============================================================================

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string, displayName: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  toggleTheme: () => Promise<void>;
  refreshUser: () => Promise<void>;
  error: string | null;
}

// ============================================================================
// NAVIGATION TYPES
// ============================================================================

export type RootStackParamList = {
  AuthNavigator: undefined;
  AppNavigator: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type AppStackParamList = {
  MainNavigator: undefined;
  TaskDetail: { taskId: string; task?: Task };
  GoalDetail: { goalId: string; goal?: Goal };
};

export type MainTabParamList = {
  Dashboard: undefined;
  Tasks: undefined;
  Goals: undefined;
  Progress: undefined;
  Profile: undefined;
};

// ============================================================================
// COMMON COMPONENT PROPS
// ============================================================================

export interface CategoryTabsProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export interface TaskCardProps {
  task: Task;
  onPress: () => void;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onToggleComplete: (taskId: string, completed: boolean) => void;
}

export interface GoalCardProps {
  goal: Goal;
  onPress: () => void;
  onEdit: (goal: Goal) => void;
  onDelete: (goalId: string) => void;
}

export interface ProgressBarProps {
  current: number;
  target: number;
  unit?: string;
  color?: string;
  showLabel?: boolean;
}

export interface GaugeIndicatorProps {
  current: number;
  target: number;
  unit: string;
  color?: string;
  size?: number;
}

// ============================================================================
// FORM STATE TYPES
// ============================================================================

export interface TaskFormState {
  title: string;
  description: string;
  dueDate: Date | null;
  priority: TaskPriority;
  category: string;
  color: string;
  errors: {
    title?: string;
    dueDate?: string;
  };
}

export interface GoalFormState {
  title: string;
  category: GoalCategory;
  targetValue: string;
  unit: string;
  color: string;
  icon: string;
  displayType: GoalDisplayType;
  errors: {
    title?: string;
    targetValue?: string;
  };
}

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  loading: boolean;
}

// ============================================================================
// DATE RANGE TYPES
// ============================================================================

export interface DateRange {
  startDate: Date;
  endDate: Date;
}
