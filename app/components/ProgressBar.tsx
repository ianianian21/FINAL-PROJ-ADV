/**
 * ProgressBar Component
 * Displays a horizontal progress bar with optional label and percentage
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LIGHT_THEME } from '../constants/colors';
import { TEXT_STYLES } from '../constants/typography';
import { SPACING, BORDER_RADIUS } from '../constants/theme';
import { ProgressBarProps } from '../types';

const ProgressBar: React.FC<ProgressBarProps> = ({
  current,
  target,
  unit,
  color,
  showLabel = true,
}) => {
  // Calculate progress percentage (capped at 100%)
  const percentage = Math.min((current / target) * 100, 100);

  return (
    
    <View style={styles.container}>
      {showLabel && (
        <View style={styles.labelContainer}>
          <Text style={styles.label}>
            {current} {unit || ''}
          </Text>
          <Text style={styles.target}>of {target}</Text>
        </View>
      )}

      <View style={styles.barContainer}>
        {/* Background bar */}
        <View style={[styles.bar, styles.barBackground]} />

        {/* Progress bar (fills based on percentage) */}
        <View
          style={[
            styles.bar,
            styles.barFill,
            {
              width: `${percentage}%`,
              backgroundColor: color,
            },
          ]}
        />
      </View>

      {showLabel && (
        <Text style={styles.percentage}>{Math.round(percentage)}%</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
  },
  label: {
    ...TEXT_STYLES.body,
    fontFamily: TEXT_STYLES.labelLarge.fontFamily,
    color: LIGHT_THEME.text,
  },
  target: {
    ...TEXT_STYLES.bodySmall,
    color: LIGHT_THEME.textSecondary,
  },
  barContainer: {
    position: 'relative',
    height: 8,
    borderRadius: BORDER_RADIUS.sm,
    overflow: 'hidden',
  },
  bar: {
    position: 'absolute',
    height: '100%',
    borderRadius: BORDER_RADIUS.sm,
  },
  barBackground: {
    width: '100%',
    backgroundColor: LIGHT_THEME.backgroundTertiary,
  },
  barFill: {
    left: 0,
  },
  percentage: {
    ...TEXT_STYLES.caption,
    color: LIGHT_THEME.textSecondary,
    marginTop: SPACING.sm,
  },
});

export default ProgressBar;
