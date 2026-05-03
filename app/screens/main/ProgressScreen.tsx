/**
 * ProgressScreen - Overview of all goals with visualized progress
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainTabParamList, AppStackParamList, Goal } from '../../types';
import { getGoals } from '../../firebase/firestore';
import { useTheme } from '../../hooks/useTheme';
import { LIGHT_THEME } from '../../constants/colors';
import { TEXT_STYLES } from '../../constants/typography';
import { SPACING, BORDER_RADIUS } from '../../constants/theme';
import ProgressBar from '../../components/ProgressBar';
import GaugeIndicator from '../../components/GaugeIndicator';
import EmptyState from '../../components/EmptyState';
import LoadingOverlay from '../../components/LoadingOverlay';

type ProgressScreenProps = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, 'Progress'>,
  NativeStackScreenProps<AppStackParamList>
>;

const ProgressScreen: React.FC<ProgressScreenProps> = () => {
  const theme = useTheme();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadGoals = async () => {
    try {
      const allGoals = await getGoals();
      setGoals(allGoals);
    } catch (err: any) {
      Alert.alert('Error', 'Failed to load goals');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadGoals();
  }, []);

  const getOverallProgress = () => {
    if (goals.length === 0) return 0;
    const totalProgress = goals.reduce((sum, goal) => {
      const progress = (goal.currentValue / goal.targetValue) * 100;
      return sum + Math.min(progress, 100);
    }, 0);
    return Math.round(totalProgress / goals.length);
  };

  if (loading) {
    return <LoadingOverlay visible={true} message="Loading progress..." />;
  }

  const overallProgress = getOverallProgress();

  return (
    <SafeAreaView style={[styles.containerSafe, { backgroundColor: theme.background }]} edges={['top', 'bottom']}>
      <ScrollView
        style={[styles.container, { backgroundColor: theme.background }]}
        refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => {
            setRefreshing(true);
            loadGoals();
          }}
        />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Progress Overview</Text>
      </View>

      {/* Overall Progress */}
      {goals.length > 0 && (
        <View style={styles.overallSection}>
          <View style={styles.overallCard}>
            <Text style={styles.overallLabel}>Overall Progress</Text>
            <Text style={styles.overallValue}>{overallProgress}%</Text>
            <ProgressBar
              current={overallProgress}
              target={100}
              color={theme.accentTeal}
              showLabel={false}
            />
            <Text style={styles.goalsCount}>
              {goals.length} {goals.length === 1 ? 'goal' : 'goals'} tracked
            </Text>
          </View>
        </View>
      )}

      {/* Individual Goals */}
      {goals.length > 0 ? (
        <View style={styles.goalsSection}>
          <Text style={styles.sectionTitle}>Goal Breakdown</Text>
          {goals.map((goal) => (
            <View key={goal.id} style={styles.goalItem}>
              <View style={styles.goalHeader}>
                <View
                  style={[
                    styles.goalIcon,
                    { backgroundColor: goal.color + '20' },
                  ]}
                >
                  <MaterialCommunityIcons
                    name={goal.icon as any}
                    size={20}
                    color={goal.color}
                  />
                </View>
                <View style={styles.goalInfo}>
                  <Text style={styles.goalTitle}>{goal.title}</Text>
                  <Text style={styles.goalCategory}>{goal.category}</Text>
                </View>
                <Text style={styles.goalProgress}>
                  {Math.round(
                    (goal.currentValue / goal.targetValue) * 100
                  )}%
                </Text>
              </View>

              {/* Progress display based on type */}
              {goal.displayType === 'gauge' ? (
                <GaugeIndicator
                  current={goal.currentValue}
                  target={goal.targetValue}
                  unit={goal.unit}
                  color={goal.color}
                  size={100}
                />
              ) : (
                <ProgressBar
                  current={goal.currentValue}
                  target={goal.targetValue}
                  unit={goal.unit}
                  color={goal.color}
                  showLabel={true}
                />
              )}
            </View>
          ))}
        </View>
      ) : (
        <EmptyState
          icon="target"
          title="No goals yet"
          description="Create your first goal to start tracking progress"
        />
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
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.md,
  },
  title: {
    ...TEXT_STYLES.heading2,
    color: LIGHT_THEME.text,
  },
  overallSection: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.lg,
  },
  overallCard: {
    backgroundColor: LIGHT_THEME.backgroundSecondary,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.lg,
    borderLeftWidth: 4,
    borderLeftColor: LIGHT_THEME.accentTeal,
  },
  overallLabel: {
    ...TEXT_STYLES.labelLarge,
    color: LIGHT_THEME.textSecondary,
    marginBottom: SPACING.sm,
  },
  overallValue: {
    ...TEXT_STYLES.heading1,
    color: LIGHT_THEME.text,
    marginBottom: SPACING.md,
  },
  goalsCount: {
    ...TEXT_STYLES.bodySmall,
    color: LIGHT_THEME.textSecondary,
    marginTop: SPACING.md,
  },
  goalsSection: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xl,
  },
  sectionTitle: {
    ...TEXT_STYLES.heading3,
    color: LIGHT_THEME.text,
    marginBottom: SPACING.md,
  },
  goalItem: {
    backgroundColor: LIGHT_THEME.backgroundSecondary,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  goalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  goalIcon: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  goalInfo: {
    flex: 1,
  },
  goalTitle: {
    ...TEXT_STYLES.labelLarge,
    color: LIGHT_THEME.text,
  },
  goalCategory: {
    ...TEXT_STYLES.caption,
    color: LIGHT_THEME.textSecondary,
    marginTop: SPACING.xs,
  },
  goalProgress: {
    ...TEXT_STYLES.labelLarge,
    color: LIGHT_THEME.accentTeal,
  },
});

export default ProgressScreen;
