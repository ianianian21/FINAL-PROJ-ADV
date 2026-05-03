/**
 * DashboardScreen
 * Home screen showing today's tasks and active goals overview
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainTabParamList, AppStackParamList, Task, Goal } from '../../types';
import { useAppContext } from '../../hooks/useAppContext';
import { useTheme } from '../../hooks/useTheme';
import { getTasks, getGoals, toggleTaskCompletion } from '../../firebase/firestore';
import { LIGHT_THEME } from '../../constants/colors';
import { TEXT_STYLES } from '../../constants/typography';
import { SPACING, BORDER_RADIUS } from '../../constants/theme';
import TaskCard from '../../components/TaskCard';
import GoalCard from '../../components/GoalCard';
import EmptyState from '../../components/EmptyState';
import LoadingOverlay from '../../components/LoadingOverlay';

type DashboardScreenProps = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, 'Dashboard'>,
  NativeStackScreenProps<AppStackParamList>
>;

const DashboardScreen: React.FC<DashboardScreenProps> = ({ navigation }) => {
  const { user } = useAppContext();
  const theme = useTheme();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Load tasks and goals from Firestore
   */
  const loadData = async () => {
    try {
      setError(null);
      const [tasksData, goalsData] = await Promise.all([
        getTasks(),
        getGoals(),
      ]);

      // Filter tasks for today
      const today = new Date();
      const todaysTasks = tasksData.filter((task) => {
        if (!task.dueDate) return false;
        const taskDate = new Date(task.dueDate);
        return (
          taskDate.getFullYear() === today.getFullYear() &&
          taskDate.getMonth() === today.getMonth() &&
          taskDate.getDate() === today.getDate()
        );
      });

      setTasks(todaysTasks);
      setGoals(goalsData);
    } catch (err: any) {
      console.error('Error loading dashboard data:', err);
      setError(err.message || 'Failed to load data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  /**
   * Load data on mount
   */
  useEffect(() => {
    loadData();
  }, []);

  /**
   * Handle refresh
   */
  const handleRefresh = () => {
    setRefreshing(true);
    loadData();
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

  /**
   * Calculate task statistics
   */
  const getTaskStats = () => {
    const completed = tasks.filter((t) => t.completed).length;
    const total = tasks.length;
    return { completed, total, remaining: total - completed };
  };

  /**
   * Calculate goals progress
   */
  const getGoalsProgress = () => {
    const totalProgress = goals.reduce((sum, goal) => {
      const progress = (goal.currentValue / goal.targetValue) * 100;
      return sum + Math.min(progress, 100);
    }, 0);
    return goals.length > 0 ? Math.round(totalProgress / goals.length) : 0;
  };

  const taskStats = getTaskStats();
  const goalsProgress = getGoalsProgress();

  if (loading) {
    return <LoadingOverlay visible={true} message="Loading dashboard..." />;
  }

  return (
    <SafeAreaView style={[styles.containerSafe, { backgroundColor: theme.background }]} edges={['top', 'bottom']}>
      <ScrollView
        style={[styles.container, { backgroundColor: theme.background }]}
        refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>
            {user?.displayName ? `Hi, ${user.displayName.split(' ')[0]}! 👋` : 'Welcome'}
          </Text>
          <Text style={styles.date}>
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'short',
              day: 'numeric',
            })}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => navigation.getParent()?.navigate('Profile' as never)}
        >
          <View style={styles.avatarButton}>
            <MaterialCommunityIcons
              name="account-circle"
              size={40}
              color={LIGHT_THEME.accentTeal}
            />
          </View>
        </TouchableOpacity>
      </View>

      {/* Stats Overview */}
      <View style={styles.statsContainer}>
        {/* Tasks Card */}
        <View style={[styles.statCard, { borderLeftColor: LIGHT_THEME.accentBlue }]}>
          <View style={styles.statHeader}>
            <MaterialCommunityIcons
              name="checkbox-marked-circle"
              size={24}
              color={LIGHT_THEME.accentBlue}
            />
            <Text style={styles.statLabel}>Today's Tasks</Text>
          </View>
          <Text style={styles.statValue}>
            {taskStats.completed}/{taskStats.total}
          </Text>
          <Text style={styles.statSubtext}>
            {taskStats.remaining === 0
              ? 'All done!'
              : `${taskStats.remaining} remaining`}
          </Text>
        </View>

        {/* Goals Card */}
        <View style={[styles.statCard, { borderLeftColor: LIGHT_THEME.accentOrange }]}>
          <View style={styles.statHeader}>
            <MaterialCommunityIcons
              name="target"
              size={24}
              color={LIGHT_THEME.accentOrange}
            />
            <Text style={styles.statLabel}>Goals Progress</Text>
          </View>
          <Text style={styles.statValue}>{goalsProgress}%</Text>
          <Text style={styles.statSubtext}>
            {goals.length} active {goals.length === 1 ? 'goal' : 'goals'}
          </Text>
        </View>
      </View>

      {/* Today's Tasks Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Today's Tasks</Text>
          <TouchableOpacity
            onPress={() => navigation.getParent()?.navigate('Tasks' as never)}
          >
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>

        {tasks.length > 0 ? (
          <View>
            {tasks.slice(0, 3).map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onPress={() =>
                  navigation.navigate('TaskDetail', {
                    taskId: task.id,
                    task,
                  })
                }
                onEdit={() =>
                  navigation.navigate('TaskDetail', {
                    taskId: task.id,
                    task,
                  })
                }
                onDelete={() => {}}
                onToggleComplete={handleToggleCompletion}
              />
            ))}
            {tasks.length > 3 && (
              <TouchableOpacity
                style={styles.viewMoreButton}
                onPress={() => navigation.getParent()?.navigate('Tasks' as never)}
              >
                <Text style={styles.viewMoreText}>
                  View {tasks.length - 3} more task{tasks.length - 3 > 1 ? 's' : ''}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          <EmptyState
            icon="inbox"
            title="No tasks for today"
            description="Great! You're all caught up. Add a new task to get started."
          />
        )}
      </View>

      {/* Active Goals Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Active Goals</Text>
          <TouchableOpacity
            onPress={() => navigation.getParent()?.navigate('Goals' as never)}
          >
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>

        {goals.length > 0 ? (
          <View>
            {goals.slice(0, 2).map((goal) => (
              <GoalCard
                key={goal.id}
                goal={goal}
                onPress={() =>
                  navigation.navigate('GoalDetail', {
                    goalId: goal.id,
                    goal,
                  })
                }
                onEdit={() =>
                  navigation.navigate('GoalDetail', {
                    goalId: goal.id,
                    goal,
                  })
                }
                onDelete={() => {}}
              />
            ))}
            {goals.length > 2 && (
              <TouchableOpacity
                style={styles.viewMoreButton}
                onPress={() => navigation.getParent()?.navigate('Goals' as never)}
              >
                <Text style={styles.viewMoreText}>
                  View {goals.length - 2} more goal{goals.length - 2 > 1 ? 's' : ''}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          <EmptyState
            icon="target"
            title="No active goals"
            description="Create your first goal to start tracking progress."
          />
        )}
      </View>

      {/* Error message */}
      {error && (
        <View style={styles.errorBanner}>
          <MaterialCommunityIcons name="alert" size={16} color={LIGHT_THEME.error} />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  containerSafe: {
    flex: 1,
    backgroundColor: LIGHT_THEME.background,
  },
  container: {
    flex: 1,
    backgroundColor: LIGHT_THEME.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.md,
  },
  greeting: {
    ...TEXT_STYLES.heading2,
    color: LIGHT_THEME.text,
  },
  date: {
    ...TEXT_STYLES.bodySmall,
    color: LIGHT_THEME.textSecondary,
    marginTop: SPACING.xs,
  },
  avatarButton: {
    padding: SPACING.sm,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: SPACING.md,
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.lg,
  },
  statCard: {
    flex: 1,
    backgroundColor: LIGHT_THEME.backgroundSecondary,
    borderRadius: BORDER_RADIUS.md,
    borderLeftWidth: 4,
    padding: SPACING.md,
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  statLabel: {
    ...TEXT_STYLES.bodySmall,
    color: LIGHT_THEME.textSecondary,
    marginLeft: SPACING.sm,
  },
  statValue: {
    ...TEXT_STYLES.heading3,
    color: LIGHT_THEME.text,
    marginBottom: SPACING.xs,
  },
  statSubtext: {
    ...TEXT_STYLES.caption,
    color: LIGHT_THEME.textTertiary,
  },
  section: {
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    ...TEXT_STYLES.heading3,
    color: LIGHT_THEME.text,
  },
  seeAll: {
    ...TEXT_STYLES.label,
    color: LIGHT_THEME.accentTeal,
  },
  viewMoreButton: {
    paddingVertical: SPACING.md,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: LIGHT_THEME.border,
    marginTop: SPACING.md,
  },
  viewMoreText: {
    ...TEXT_STYLES.label,
    color: LIGHT_THEME.accentTeal,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: LIGHT_THEME.error + '10',
    borderTopWidth: 1,
    borderTopColor: LIGHT_THEME.error + '40',
    padding: SPACING.md,
    marginHorizontal: SPACING.lg,
    borderRadius: BORDER_RADIUS.sm,
    marginBottom: SPACING.lg,
  },
  errorText: {
    ...TEXT_STYLES.bodySmall,
    color: LIGHT_THEME.error,
    marginLeft: SPACING.md,
    flex: 1,
  },
});

export default DashboardScreen;
