/**
 * CategoryTabs Component
 * Horizontal scrollable category tabs for filtering
 */

import React from 'react';
import {
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { LIGHT_THEME } from '../constants/colors';
import { TEXT_STYLES } from '../constants/typography';
import { SPACING, BORDER_RADIUS } from '../constants/theme';
import { CategoryTabsProps } from '../types';


const CategoryTabs: React.FC<CategoryTabsProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
}) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      scrollEnabled={true}
    >
      {categories.map((category) => {
        const isSelected = category === selectedCategory;

        return (
          <TouchableOpacity
            key={category}
            onPress={() => onSelectCategory(category)}
            style={[
              styles.tab,
              isSelected && styles.tabActive,
            ]}
          >
            <Text
              style={[
                styles.tabText,
                isSelected && styles.tabTextActive,
              ]}
            >
              {category}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
height: 48,
flexGrow: 0,
flexShrink: 0,
  },
  contentContainer: {
    paddingHorizontal: SPACING.lg,
    columnGap: SPACING.md,
    alignItems: 'flex-start',
    paddingVertical: SPACING.sm,
  },
  tab: {
    paddingHorizontal: SPACING.lg,
    borderRadius: BORDER_RADIUS.full,
    borderWidth: 1,
    borderColor: LIGHT_THEME.border,
    backgroundColor: LIGHT_THEME.background,
    minWidth: 80,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabActive: {
    backgroundColor: LIGHT_THEME.accentTeal,
    borderColor: LIGHT_THEME.accentTeal,
  },
  tabText: {
    ...TEXT_STYLES.label,
    color: LIGHT_THEME.textSecondary,
  },
  tabTextActive: {
    color: LIGHT_THEME.textInverse,
    fontFamily: TEXT_STYLES.labelLarge.fontFamily,
  },
});

export default CategoryTabs;
