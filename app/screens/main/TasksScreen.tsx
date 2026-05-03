/**
 * TasksScreen
 * Full list of all tasks with filtering and creation
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainTabParamList, AppStackParamList, Task } from '../../types';
import { getTasks, deleteTask, toggleTaskCompletion } from '../../firebase/firestore';
import { useTheme } from '../../hooks/useTheme';
import { LIGHT_THEME } from '../../constants/colors';
import { TEXT_STYLES } from '../../constants/typography';
import { SPACING, BORDER_RADIUS } from '../../constants/theme';
import { TASK_CATEGORIES } from '../../constants/theme';
import TaskCard from '../../components/TaskCard';
import CategoryTabs from '../../components/CategoryTabs';
import EmptyState from '../../components/EmptyState';
import LoadingOverlay from '../../components/LoadingOverlay';

type TasksScreenProps = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, 'Tasks'>,
  NativeStackScreenProps<AppStackParamList>
>;

const TasksScreen: React.FC<TasksScreenProps> = ({ navigation }) => {
  const theme = useTheme();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showCompleted, setShowCompleted] = useState(true);

  /**
   * Load tasks from Firestore
   */
  const loadTasks = async () => {
    try {
      const allTasks = await getTasks();
      setTasks(allTasks);
    } catch (err: any) {
      Alert.alert('Error', 'Failed to load tasks');
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  /**
   * Filter tasks based on category and completion status
   */
  const getFilteredTasks = () => {
    return tasks.filter((task) => {
      const categoryMatch =
        selectedCategory === 'All' || task.category === selectedCategory;
      const completionMatch = showCompleted || !task.completed;
      return categoryMatch && completionMatch;
    });
  };

  /**
   * Handle delete task
   */
  const handleDeleteTask = async (taskId: string) => {
    try {
      await deleteTask(taskId);
      setTasks((prev) => prev.filter((t) => t.id !== taskId));
    } catch (err: any) {
      Alert.alert('Error', 'Failed to delete task');
    }
  };

  /**
   * Handle toggle task completion
   */
  const handleToggleCompletion = async (taskId: string, completed: boolean) => {
    try {
      await toggleTaskCompletion(taskId, completed);
      setTasks((prev) =>
        prev.map((t) =>
          t.id === taskId ? { ...t, completed } : t
        )
      );
    } catch (err: any) {
      Alert.alert('Error', 'Failed to update task');
    }
  };

  const filteredTasks = getFilteredTasks();
  const categories = ['All', ...TASK_CATEGORIES];

  if (loading) {
    return <LoadingOverlay visible={true} message="Loading tasks..." />;
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['top', 'bottom']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Tasks</Text>
        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: theme.accentTeal }]}
          onPress={() => navigation.navigate('TaskDetail', { taskId: 'new' })}
        >
          <MaterialCommunityIcons
            name="plus"
            size={24}
            color={theme.textInverse}
          />
        </TouchableOpacity>
      </View>

      {/* Category Tabs */}
      <CategoryTabs
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      {/* Toggle completed tasks */}
      <View style={styles.filterRow}>
        <TouchableOpacity
          style={styles.toggleButton}
          onPress={() => setShowCompleted(!showCompleted)}
        >
          <MaterialCommunityIcons
            name={showCompleted ? 'eye' : 'eye-off'}
            size={18}
            color={LIGHT_THEME.textSecondary}
          />
          <Text style={styles.toggleText}>
            {showCompleted ? 'Hide' : 'Show'} Completed
          </Text>
        </TouchableOpacity>
      </View>

      {/* Task List */}
      {filteredTasks.length > 0 ? (
        <FlatList
          data={filteredTasks}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.taskItem}>
              <TaskCard
                task={item}
                onPress={() =>
                  navigation.navigate('TaskDetail', {
                    taskId: item.id,
                    task: item,
                  })
                }
                onEdit={() =>
                  navigation.navigate('TaskDetail', {
                    taskId: item.id,
                    task: item,
                  })
                }
                onDelete={handleDeleteTask}
                onToggleComplete={handleToggleCompletion}
              />
            </View>
          )}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => {
                setRefreshing(true);
                loadTasks();
              }}
            />
          }
        />
      ) : (
        <View style={styles.emptyContainer}>
          <EmptyState
            icon="inbox"
            title="No tasks"
            description={
              selectedCategory === 'All'
                ? 'Create your first task to get started'
                : `No tasks in ${selectedCategory} category`
            }
          />
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: LIGHT_THEME.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
    paddingBottom: 0,
  },
  title: {
    ...TEXT_STYLES.heading2,
    color: LIGHT_THEME.text,
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: LIGHT_THEME.accentTeal,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterRow: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.sm,
    paddingBottom: SPACING.sm,
  },
  toggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.sm,
    backgroundColor: LIGHT_THEME.backgroundSecondary,
  },
  toggleText: {
    ...TEXT_STYLES.bodySmall,
    color: LIGHT_THEME.textSecondary,
    marginLeft: SPACING.sm,
  },
  taskItem: {
    paddingHorizontal: SPACING.lg,
  },
  listContent: {
    paddingHorizontal: SPACING.lg,
    paddingTop: 0,
    paddingVertical: SPACING.md,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
  },
});

export default TasksScreen;
