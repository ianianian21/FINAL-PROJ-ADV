/**
 * GoalsScreen
 * Full list of all goals with creation and management
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
import { MainTabParamList, AppStackParamList, Goal } from '../../types';
import { getGoals, deleteGoal } from '../../firebase/firestore';
import { useTheme } from '../../hooks/useTheme';
import { LIGHT_THEME } from '../../constants/colors';
import { TEXT_STYLES } from '../../constants/typography';
import { SPACING } from '../../constants/theme';
import { GOAL_CATEGORIES } from '../../constants/theme';
import GoalCard from '../../components/GoalCard';
import CategoryTabs from '../../components/CategoryTabs';
import EmptyState from '../../components/EmptyState';
import LoadingOverlay from '../../components/LoadingOverlay';

type GoalsScreenProps = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, 'Goals'>,
  NativeStackScreenProps<AppStackParamList>
>;

const GoalsScreen: React.FC<GoalsScreenProps> = ({ navigation }) => {
  const theme = useTheme();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  /**
   * Load goals from Firestore
   */
  const loadGoals = async () => {
    try {
      const allGoals = await getGoals();
      setGoals(allGoals);
    } catch (err: any) {
      Alert.alert('Error', 'Failed to load goals');
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadGoals();
  }, []);

  /**
   * Filter goals by category
   */
  const getFilteredGoals = () => {
    if (selectedCategory === 'All') return goals;
    return goals.filter((goal) => goal.category === selectedCategory);
  };

  /**
   * Handle delete goal
   */
  const handleDeleteGoal = async (goalId: string) => {
    try {
      await deleteGoal(goalId);
      setGoals((prev) => prev.filter((g) => g.id !== goalId));
    } catch (err: any) {
      Alert.alert('Error', 'Failed to delete goal');
    }
  };

  const filteredGoals = getFilteredGoals();
  const categories = ['All', ...GOAL_CATEGORIES];

  if (loading) {
    return <LoadingOverlay visible={true} message="Loading goals..." />;
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['top', 'bottom']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Goals</Text>
        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: theme.accentTeal }]}
          onPress={() => navigation.navigate('GoalDetail', { goalId: 'new' })}
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

      {/* Goals List */}
      {filteredGoals.length > 0 ? (
        <FlatList
          data={filteredGoals}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.goalItem}>
              <GoalCard
                goal={item}
                onPress={() =>
                  navigation.navigate('GoalDetail', {
                    goalId: item.id,
                    goal: item,
                  })
                }
                onEdit={() =>
                  navigation.navigate('GoalDetail', {
                    goalId: item.id,
                    goal: item,
                  })
                }
                onDelete={handleDeleteGoal}
              />
            </View>
          )}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => {
                setRefreshing(true);
                loadGoals();
              }}
            />
          }
        />
      ) : (
        <View style={styles.emptyContainer}>
          <EmptyState
            icon="target"
            title="No goals"
            description={
              selectedCategory === 'All'
                ? 'Create your first goal to start tracking progress'
                : `No goals in ${selectedCategory} category`
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
  goalItem: {
    paddingHorizontal: SPACING.lg,
  },
  listContent: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
  },
});

export default GoalsScreen;
