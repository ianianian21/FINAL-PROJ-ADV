/**
 * EmptyState Component
 * Displays when there's no data to show (empty task list, etc.)
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LIGHT_THEME } from '../constants/colors';
import { TEXT_STYLES } from '../constants/typography';
import { SPACING } from '../constants/theme';


interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
  iconColor?: string;
  iconSize?: number;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  icon = 'inbox',
  title,
  description,
  iconColor = LIGHT_THEME.textTertiary,
  iconSize = 64,
}) => {
  return (
    <View style={styles.container}>
      <MaterialCommunityIcons
        name={icon as any}
        size={iconSize}
        color={iconColor}
        style={styles.icon}
      />
      <Text style={styles.title}>{title}</Text>
      {description && (
        <Text style={styles.description}>{description}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.xl,
    minHeight: 200,
  },
  icon: {
    marginBottom: SPACING.lg,
  },
  title: {
    ...TEXT_STYLES.heading3,
    color: LIGHT_THEME.text,
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  description: {
    ...TEXT_STYLES.body,
    color: LIGHT_THEME.textSecondary,
    textAlign: 'center',
  },
});

export default EmptyState;
