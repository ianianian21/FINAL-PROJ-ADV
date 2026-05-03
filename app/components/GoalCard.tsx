/**
 * GoalCard Component
 * Displays a single goal with progress indicator and action buttons
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LIGHT_THEME } from '../constants/colors';
import { TEXT_STYLES } from '../constants/typography';
import { SPACING, BORDER_RADIUS } from '../constants/theme';
import { GoalCardProps } from '../types';
import ProgressBar from './ProgressBar';


const GoalCard: React.FC<GoalCardProps> = ({
  goal,
  onPress,
  onEdit,
  onDelete,
}) => {
  const handleDelete = () => {
    Alert.alert(
      'Delete Goal',
      'Are you sure you want to delete this goal?',
      [
        { text: 'Cancel', onPress: () => {} },
        {
          text: 'Delete',
          onPress: () => onDelete(goal.id),
          style: 'destructive',
        },
      ]
    );
  };

  // Get icon for the goal
  const getGoalIcon = () => {
    try {
      return (
        <MaterialCommunityIcons
          name={goal.icon as any}
          size={28}
          color={goal.color}
        />
      );
    } catch (e) {
      return (
        <MaterialCommunityIcons
          name="target"
          size={28}
          color={goal.color}
        />
      );
    }
  };

  return (

    <TouchableOpacity onPress={onPress} style={styles.card}>
      {/* Header with icon and title */}
      <View style={styles.header}>
        <View
          style={[
            styles.iconContainer,
            { backgroundColor: goal.color + '20' },
          ]}
        >
          {getGoalIcon()}
        </View>

        <View style={styles.titleContainer}>
          <Text style={styles.title}>{goal.title}</Text>
          <View style={styles.categoryRow}>
            <Text style={styles.category}>{goal.category}</Text>
            <Text style={styles.displayType}>
              • {goal.displayType.charAt(0).toUpperCase() + goal.displayType.slice(1)}
            </Text>
          </View>
        </View>

        <TouchableOpacity style={styles.menuButton}>
          <MaterialCommunityIcons
            name="dots-vertical"
            size={20}
            color={LIGHT_THEME.textSecondary}
          />
        </TouchableOpacity>
      </View>

      {/* Progress section */}
      <View style={styles.progressSection}>
        <ProgressBar
          current={goal.currentValue}
          target={goal.targetValue}
          unit={goal.unit}
          color={goal.color}
          showLabel={true}
        />
      </View>

      {/* Action buttons */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => onEdit(goal)}
        >
          <MaterialCommunityIcons
            name="pencil"
            size={18}
            color={LIGHT_THEME.textSecondary}
          />
          <Text style={styles.actionText}>Edit</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleDelete}
        >
          <MaterialCommunityIcons
            name="delete"
            size={18}
            color={LIGHT_THEME.error}
          />
          <Text style={[styles.actionText, { color: LIGHT_THEME.error }]}>
            Delete
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: LIGHT_THEME.background,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: LIGHT_THEME.border,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    shadowColor: LIGHT_THEME.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: BORDER_RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    ...TEXT_STYLES.labelLarge,
    color: LIGHT_THEME.text,
  },
  categoryRow: {
    flexDirection: 'row',
    marginTop: SPACING.xs,
  },
  category: {
    ...TEXT_STYLES.caption,
    color: LIGHT_THEME.textSecondary,
  },
  displayType: {
    ...TEXT_STYLES.caption,
    color: LIGHT_THEME.textSecondary,
    marginLeft: SPACING.xs,
  },
  menuButton: {
    padding: SPACING.sm,
  },
  progressSection: {
    marginBottom: SPACING.md,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.sm,
    marginHorizontal: SPACING.sm,
    borderRadius: BORDER_RADIUS.sm,
    backgroundColor: LIGHT_THEME.backgroundSecondary,
  },
  actionText: {
    ...TEXT_STYLES.caption,
    color: LIGHT_THEME.textSecondary,
    marginLeft: SPACING.xs,
    fontFamily: TEXT_STYLES.labelSmall.fontFamily,
  },
});

export default GoalCard;
