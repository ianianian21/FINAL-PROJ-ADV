/**
 * GaugeIndicator Component
 * Displays a circular gauge/speedometer style progress indicator
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LIGHT_THEME } from '../constants/colors';
import { TEXT_STYLES } from '../constants/typography';
import { SPACING } from '../constants/theme';
import { GaugeIndicatorProps } from '../types';


const GaugeIndicator: React.FC<GaugeIndicatorProps> = ({
  current,
  target,
  unit,
  color,
  size = 120,
}) => {
  // Note: percentage and circumference are kept for future SVG gauge implementation
  return (
    <View style={[styles.container, { width: size, height: size }]}>
      {/* Outer circle background */}
      <View
        style={[
          styles.circle,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: LIGHT_THEME.backgroundTertiary,
          },
        ]}
      />

      {/* Inner content */}
      <View style={styles.content}>
        <Text style={styles.value}>{current}</Text>
        <Text style={styles.unit}>{unit}</Text>
        <Text style={styles.target}>/ {target}</Text>
      </View>

      {/* Progress indicator (simplified - in production you'd use Svg for true gauge) */}
      <View
        style={[
          styles.progressRing,
          {
            width: size - 20,
            height: size - 20,
            borderRadius: (size - 20) / 2,
            borderWidth: 4,
            borderColor: color,
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  circle: {
    position: 'absolute',
  },
  content: {
    alignItems: 'center',
    zIndex: 1,
  },
  value: {
    ...TEXT_STYLES.heading2,
    color: LIGHT_THEME.text,
  },
  unit: {
    ...TEXT_STYLES.caption,
    color: LIGHT_THEME.textSecondary,
    marginTop: SPACING.xs,
  },
  target: {
    ...TEXT_STYLES.bodySmall,
    color: LIGHT_THEME.textTertiary,
    marginTop: SPACING.xs,
  },
  progressRing: {
    position: 'absolute',
  },
});

export default GaugeIndicator;
