/**
 * TaskCard Component
 * Displays a single task with status, priority, due date, and action buttons
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
import { TaskCardProps } from '../types';
import { formatRelativeDate, isOverdue } from '../utils/dates';

const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onPress,
  onEdit,
  onDelete,
  onToggleComplete,
}) => {
  const overdue = isOverdue(task.dueDate, task.completed);

  const handleDelete = () => {
    Alert.alert(
      'Delete Task',
      'Are you sure you want to delete this task?',
      [
        { text: 'Cancel', onPress: () => {} },
        {
          text: 'Delete',
          onPress: () => onDelete(task.id),
          style: 'destructive',
        },
      ]
    );
  };

  // Get priority icon and color
  const getPriorityColor = () => {
    switch (task.priority) {
      case 'high':
        return LIGHT_THEME.priorityHigh;
      case 'medium':
        return LIGHT_THEME.priorityMedium;
      case 'low':
        return LIGHT_THEME.priorityLow;
      default:
        return LIGHT_THEME.textTertiary;
    }
  };

  return ( 
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.card,
        task.completed && styles.cardCompleted,
        overdue && styles.cardOverdue,
      ]}
    >
      {/* Checkbox and title */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => onToggleComplete(task.id, !task.completed)}
          style={[
            styles.checkbox,
            task.completed && styles.checkboxCompleted,
          ]}
        >
          {task.completed && (
            <MaterialCommunityIcons
              name="check"
              size={16}
              color={LIGHT_THEME.success}
            />
          )}
        </TouchableOpacity>

        <View style={styles.titleContainer}>
          <Text
            style={[styles.title, task.completed && styles.titleCompleted]}
            numberOfLines={1}
          >
            {task.title}
          </Text>
          {task.description && (
            <Text style={styles.description} numberOfLines={1}>
              {task.description}
            </Text>
          )}
        </View>
      </View>

      {/* Metadata */}
      <View style={styles.meta}>
        {/* Priority indicator */}
        <View style={[styles.badge, { backgroundColor: getPriorityColor() + '20' }]}>
          <View
            style={[styles.priorityDot, { backgroundColor: getPriorityColor() }]}
          />
          <Text style={[styles.badgeText, { color: getPriorityColor() }]}>
            {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
          </Text>
        </View>

        {/* Due date */}
        {task.dueDate && (
          <Text style={[styles.dueDate, overdue && styles.dueDateOverdue]}>
            {formatRelativeDate(task.dueDate)}
          </Text>
        )}

        {/* Category */}
        <View
          style={[
            styles.categoryBadge,
            { backgroundColor: task.color + '20' },
          ]}
        >
          <Text style={[styles.categoryText, { color: task.color }]}>
            {task.category}
          </Text>
        </View>
      </View>

      {/* Action buttons */}
      <View style={styles.actions}>
        <TouchableOpacity onPress={() => onEdit(task)}>
          <MaterialCommunityIcons
            name="pencil"
            size={20}
            color={LIGHT_THEME.textSecondary}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleDelete}>
          <MaterialCommunityIcons
            name="delete"
            size={20}
            color={LIGHT_THEME.error}
          />
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
  cardCompleted: {
    backgroundColor: LIGHT_THEME.backgroundSecondary,
    borderColor: LIGHT_THEME.success + '40',
  },
  cardOverdue: {
    borderColor: LIGHT_THEME.error + '40',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: SPACING.md,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: BORDER_RADIUS.sm,
    borderWidth: 2,
    borderColor: LIGHT_THEME.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
    marginTop: SPACING.xs,
  },
  checkboxCompleted: {
    backgroundColor: LIGHT_THEME.success + '20',
    borderColor: LIGHT_THEME.success,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    ...TEXT_STYLES.labelLarge,
    color: LIGHT_THEME.text,
  },
  titleCompleted: {
    textDecorationLine: 'line-through',
    color: LIGHT_THEME.textSecondary,
  },
  description: {
    ...TEXT_STYLES.bodySmall,
    color: LIGHT_THEME.textSecondary,
    marginTop: SPACING.xs,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
    flexWrap: 'wrap',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
    marginRight: SPACING.sm,
    marginBottom: SPACING.xs,
  },
  priorityDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: SPACING.xs,
  },
  badgeText: {
    ...TEXT_STYLES.caption,
    fontFamily: TEXT_STYLES.labelSmall.fontFamily,
  },
  dueDate: {
    ...TEXT_STYLES.caption,
    color: LIGHT_THEME.textSecondary,
    marginRight: SPACING.sm,
    marginBottom: SPACING.xs,
  },
  dueDateOverdue: {
    color: LIGHT_THEME.error,
  },
  categoryBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
    marginBottom: SPACING.xs,
  },
  categoryText: {
    ...TEXT_STYLES.caption,
    fontFamily: TEXT_STYLES.labelSmall.fontFamily,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: SPACING.lg,
  },
});

export default TaskCard;
