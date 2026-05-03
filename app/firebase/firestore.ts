/**
 * Firestore database service
 * Handles all CRUD operations for tasks, goals, and user preferences
 */

import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  setDoc,
  query,
  where,
  orderBy,
  Timestamp,
  writeBatch,
  onSnapshot,
} from 'firebase/firestore';
import { db } from './config';
import { Task, TaskInput, Goal, GoalInput, GoalProgress, User } from '../types';
import { getCurrentUserId } from './auth';

// ============================================================================
// USER OPERATIONS
// ============================================================================

/**
 * Get the current user's profile from Firestore
 */
export const getUserProfile = async (userId: string): Promise<User | null> => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (userDoc.exists()) {
      const data = userDoc.data();
      return {
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
      } as User;
    }
    return null;
  } catch (error: any) {
    console.error('Error fetching user profile:', error);
    throw new Error('Failed to fetch user profile');
  }
};

/**
 * Update user theme preference
 */
export const updateUserTheme = async (userId: string, theme: 'light' | 'dark'): Promise<void> => {
  try {
    await setDoc(doc(db, 'users', userId), { theme }, { merge: true });
  } catch (error: any) {
    console.error('Error updating user theme:', error);
    throw new Error('Failed to update theme');
  }
};

// ============================================================================
// TASK OPERATIONS
// ============================================================================

/**
 * Create a new task for the current user
 * Returns the created task with its Firestore ID
 */
export const createTask = async (taskInput: TaskInput): Promise<Task> => {
  try {
    const userId = getCurrentUserId();
    if (!userId) throw new Error('User not authenticated');

    // Convert Task input to Firestore format
    const taskData = {
      title: taskInput.title,
      description: taskInput.description,
      completed: false,
      dueDate: taskInput.dueDate ? Timestamp.fromDate(taskInput.dueDate) : null,
      priority: taskInput.priority,
      category: taskInput.category,
      color: taskInput.color,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    // Add task to user's tasks subcollection
    const docRef = await addDoc(
      collection(db, 'users', userId, 'tasks'),
      taskData
    );

    // Return the created task with its ID
    return {
      id: docRef.id,
      ...taskInput,
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  } catch (error: any) {
    console.error('Error creating task:', error);
    throw new Error('Failed to create task');
  }
};

// Replace getTasks with a real-time listener version
export const subscribeToTasks = (
  callback: (tasks: Task[]) => void,
  category?: string
): (() => void) => {
  const userId = getCurrentUserId();
  if (!userId) return () => {};

  const baseQuery = collection(db, 'users', userId, 'tasks');
  const q = category
    ? query(baseQuery, where('category', '==', category), orderBy('createdAt', 'desc'))
    : query(baseQuery, orderBy('createdAt', 'desc'));

  // Returns unsubscribe function
  return onSnapshot(q, (snapshot) => {
    const tasks = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        title: data.title,
        description: data.description,
        completed: data.completed,
        dueDate: data.dueDate?.toDate() || null,
        priority: data.priority,
        category: data.category,
        color: data.color,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      } as Task;
    });
    callback(tasks);
  }, (error) => {
    console.error('Task listener error:', error);
  });
};

/**
 * Get all tasks for the current user, optionally filtered by category
 * Results are ordered by creation date (newest first)
 */
export const getTasks = async (category?: string): Promise<Task[]> => {
  try {
    const userId = getCurrentUserId();
    if (!userId) throw new Error('User not authenticated');

    // Build query: get tasks for current user
    const baseQuery = collection(db, 'users', userId, 'tasks');
    let q = query(baseQuery, orderBy('createdAt', 'desc'));

    if (category) {
      q = query(
        baseQuery,
        where('category', '==', category),
        orderBy('createdAt', 'desc')
      );
    }

    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        title: data.title,
        description: data.description,
        completed: data.completed,
        dueDate: data.dueDate?.toDate() || null,
        priority: data.priority,
        category: data.category,
        color: data.color,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      } as Task;
    });
  } catch (error: any) {
    console.error('Error fetching tasks:', error);
    throw new Error('Failed to fetch tasks');
  }
};

/**
 * Get a single task by ID
 */
export const getTaskById = async (taskId: string): Promise<Task | null> => {
  try {
    const userId = getCurrentUserId();
    if (!userId) throw new Error('User not authenticated');

    const taskDoc = await getDoc(doc(db, 'users', userId, 'tasks', taskId));
    if (taskDoc.exists()) {
      const data = taskDoc.data();
      return {
        id: taskDoc.id,
        title: data.title,
        description: data.description,
        completed: data.completed,
        dueDate: data.dueDate?.toDate() || null,
        priority: data.priority,
        category: data.category,
        color: data.color,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      } as Task;
    }
    return null;
  } catch (error: any) {
    console.error('Error fetching task:', error);
    throw new Error('Failed to fetch task');
  }
};

/**
 * Update an existing task
 */
export const updateTask = async (taskId: string, updates: Partial<TaskInput>): Promise<void> => {
  try {
    const userId = getCurrentUserId();
    if (!userId) throw new Error('User not authenticated');

    // Convert dates to Firestore timestamps
    const updateData: any = { ...updates, updatedAt: Timestamp.now() };
    if (updates.dueDate !== undefined) {
      updateData.dueDate = updates.dueDate ? Timestamp.fromDate(updates.dueDate) : null;
    }

    await updateDoc(doc(db, 'users', userId, 'tasks', taskId), updateData);
  } catch (error: any) {
    console.error('Error updating task:', error);
    throw new Error('Failed to update task');
  }
};

/**
 * Toggle task completion status
 */
export const toggleTaskCompletion = async (taskId: string, completed: boolean): Promise<void> => {
  try {
    const userId = getCurrentUserId();
    if (!userId) throw new Error('User not authenticated');

    await updateDoc(doc(db, 'users', userId, 'tasks', taskId), {
      completed,
      updatedAt: Timestamp.now(),
    });
  } catch (error: any) {
    console.error('Error toggling task completion:', error);
    throw new Error('Failed to update task');
  }
};

/**
 * Delete a task
 */
export const deleteTask = async (taskId: string): Promise<void> => {
  try {
    const userId = getCurrentUserId();
    if (!userId) throw new Error('User not authenticated');

    await deleteDoc(doc(db, 'users', userId, 'tasks', taskId));
  } catch (error: any) {
    console.error('Error deleting task:', error);
    throw new Error('Failed to delete task');
  }
};

// ============================================================================
// GOAL OPERATIONS
// ============================================================================

/**
 * Create a new goal for the current user
 */
export const createGoal = async (goalInput: GoalInput): Promise<Goal> => {
  try {
    const userId = getCurrentUserId();
    if (!userId) throw new Error('User not authenticated');

    const goalData = {
      title: goalInput.title,
      category: goalInput.category,
      targetValue: goalInput.targetValue,
      unit: goalInput.unit,
      currentValue: 0,
      color: goalInput.color,
      icon: goalInput.icon,
      displayType: goalInput.displayType,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    const docRef = await addDoc(
      collection(db, 'users', userId, 'goals'),
      goalData
    );

    return {
      id: docRef.id,
      currentValue: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...goalInput,
    };
  } catch (error: any) {
    console.error('Error creating goal:', error);
    throw new Error('Failed to create goal');
  }
};

/**
 * Get all goals for the current user
 */
export const getGoals = async (): Promise<Goal[]> => {
  try {
    const userId = getCurrentUserId();
    if (!userId) throw new Error('User not authenticated');

    const q = query(
      collection(db, 'users', userId, 'goals'),
      orderBy('createdAt', 'desc')
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        title: data.title,
        category: data.category,
        targetValue: data.targetValue,
        unit: data.unit,
        currentValue: data.currentValue,
        color: data.color,
        icon: data.icon,
        displayType: data.displayType,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      } as Goal;
    });
  } catch (error: any) {
    console.error('Error fetching goals:', error);
    throw new Error('Failed to fetch goals');
  }
};

/**
 * Get a single goal by ID
 */
export const getGoalById = async (goalId: string): Promise<Goal | null> => {
  try {
    const userId = getCurrentUserId();
    if (!userId) throw new Error('User not authenticated');

    const goalDoc = await getDoc(doc(db, 'users', userId, 'goals', goalId));
    if (goalDoc.exists()) {
      const data = goalDoc.data();
      return {
        id: goalDoc.id,
        title: data.title,
        category: data.category,
        targetValue: data.targetValue,
        unit: data.unit,
        currentValue: data.currentValue,
        color: data.color,
        icon: data.icon,
        displayType: data.displayType,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      } as Goal;
    }
    return null;
  } catch (error: any) {
    console.error('Error fetching goal:', error);
    throw new Error('Failed to fetch goal');
  }
};

/**
 * Update a goal
 */
export const updateGoal = async (goalId: string, updates: Partial<GoalInput>): Promise<void> => {
  try {
    const userId = getCurrentUserId();
    if (!userId) throw new Error('User not authenticated');

    const updateData = { ...updates, updatedAt: Timestamp.now() };
    await updateDoc(doc(db, 'users', userId, 'goals', goalId), updateData);
  } catch (error: any) {
    console.error('Error updating goal:', error);
    throw new Error('Failed to update goal');
  }
};

/**
 * Update goal's current value (progress)
 */
export const updateGoalProgress = async (
  goalId: string,
  newCurrentValue: number
): Promise<void> => {
  try {
    const userId = getCurrentUserId();
    if (!userId) throw new Error('User not authenticated');

    // Add a progress entry to the progress subcollection
    const progressData = {
      value: newCurrentValue,
      date: Timestamp.now(),
    };

    await addDoc(
      collection(db, 'users', userId, 'goals', goalId, 'progress'),
      progressData
    );

    // Update the goal's current value
    await updateDoc(doc(db, 'users', userId, 'goals', goalId), {
      currentValue: newCurrentValue,
      updatedAt: Timestamp.now(),
    });
  } catch (error: any) {
    console.error('Error updating goal progress:', error);
    throw new Error('Failed to update goal progress');
  }
};

/**
 * Get progress history for a goal
 */
export const getGoalProgress = async (goalId: string): Promise<GoalProgress[]> => {
  try {
    const userId = getCurrentUserId();
    if (!userId) throw new Error('User not authenticated');

    const q = query(
      collection(db, 'users', userId, 'goals', goalId, 'progress'),
      orderBy('date', 'desc')
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        value: data.value,
        date: data.date?.toDate() || new Date(),
        notes: data.notes,
      } as GoalProgress;
    });
  } catch (error: any) {
    console.error('Error fetching goal progress:', error);
    throw new Error('Failed to fetch goal progress');
  }
};

/**
 * Delete a goal and all its progress entries
 */
export const deleteGoal = async (goalId: string): Promise<void> => {
  try {
    const userId = getCurrentUserId();
    if (!userId) throw new Error('User not authenticated');

    // First, delete all progress entries
    const progressDocs = await getDocs(
      collection(db, 'users', userId, 'goals', goalId, 'progress')
    );

    const batch = writeBatch(db);
    progressDocs.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });

    // Then delete the goal itself
    batch.delete(doc(db, 'users', userId, 'goals', goalId));

    await batch.commit();
  } catch (error: any) {
    console.error('Error deleting goal:', error);
    throw new Error('Failed to delete goal');
  }
};
