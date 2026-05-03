/**
 * GoalDetailScreen - Create, edit, and track goals with progress updates
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppStackParamList } from '../../types';
import { createGoal, updateGoal, updateGoalProgress } from '../../firebase/firestore';
import { useTheme } from '../../hooks/useTheme';
import { LIGHT_THEME } from '../../constants/colors';
import { TEXT_STYLES } from '../../constants/typography';
import { SPACING, BORDER_RADIUS, GOAL_CATEGORIES, GOAL_ICONS, ACCENT_COLORS, GOAL_DISPLAY_TYPES } from '../../constants/theme';
import ProgressBar from '../../components/ProgressBar';
import GaugeIndicator from '../../components/GaugeIndicator';
import LoadingOverlay from '../../components/LoadingOverlay';

type GoalDetailScreenProps = NativeStackScreenProps<
  AppStackParamList,
  'GoalDetail'
>;

const GoalDetailScreen: React.FC<GoalDetailScreenProps> = ({ route, navigation }) => {
  const theme = useTheme();
  const { goalId, goal: initialGoal } = route.params;
  const isNewGoal = goalId === 'new';

  const [form, setForm] = useState({
    title: initialGoal?.title || '',
    category: initialGoal?.category || GOAL_CATEGORIES[0],
    targetValue: initialGoal?.targetValue.toString() || '',
    unit: initialGoal?.unit || '',
    color: initialGoal?.color || ACCENT_COLORS[0].value,
    icon: initialGoal?.icon || GOAL_ICONS[0],
    displayType: initialGoal?.displayType || 'bar' as const,
  });

  const [progressValue, setProgressValue] = useState(
    initialGoal?.currentValue.toString() || '0'
  );

  const [loading, setLoading] = useState(false);
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const [showDisplayTypePicker, setShowDisplayTypePicker] = useState(false);

  /**
   * Handle save goal
   */
  const handleSaveGoal = async () => {
    if (!form.title.trim() || !form.targetValue || !form.unit) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }

    try {
      setLoading(true);
      const goalData = {
        ...form,
        category: form.category as any,
        targetValue: parseFloat(form.targetValue),
      };

      if (isNewGoal) {
        await createGoal(goalData);
      } else {
        await updateGoal(goalId, goalData);
      }

      Alert.alert('Success', isNewGoal ? 'Goal created' : 'Goal updated');
      navigation.goBack();
    } catch (err: any) {
      Alert.alert('Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle update progress
   */
  const handleUpdateProgress = async () => {
    try {
      setLoading(true);
      const newValue = parseFloat(progressValue);
      if (isNaN(newValue)) {
        Alert.alert('Error', 'Please enter a valid number');
        return;
      }
      await updateGoalProgress(goalId, newValue);
      Alert.alert('Success', 'Progress updated');
      navigation.goBack();
    } catch (err: any) {
      Alert.alert('Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.containerSafe, { backgroundColor: theme.background }]} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={[styles.container, { backgroundColor: theme.background }]}
      >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <MaterialCommunityIcons
              name="chevron-left"
              size={24}
              color={LIGHT_THEME.text}
            />
          </TouchableOpacity>
          <Text style={styles.title}>
            {isNewGoal ? 'New Goal' : 'Edit Goal'}
          </Text>
          <TouchableOpacity onPress={handleSaveGoal} disabled={loading}>
            <Text style={styles.saveButton}>
              {loading ? 'Saving...' : 'Save'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Form */}
        <View style={styles.form}>
          {/* Title */}
          <View style={styles.section}>
            <Text style={styles.label}>Goal Title *</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Enter goal title"
              placeholderTextColor={LIGHT_THEME.textTertiary}
              value={form.title}
              onChangeText={(value) =>
                setForm((prev) => ({ ...prev, title: value }))
              }
            />
          </View>

          {/* Category */}
          <View style={styles.section}>
            <Text style={styles.label}>Category *</Text>
            <TouchableOpacity
              style={styles.pickerButton}
              onPress={() => setShowCategoryPicker(!showCategoryPicker)}
            >
              <Text style={styles.pickerButtonText}>{form.category}</Text>
              <MaterialCommunityIcons
                name={showCategoryPicker ? 'chevron-up' : 'chevron-down'}
                size={20}
                color={LIGHT_THEME.textSecondary}
              />
            </TouchableOpacity>
            {showCategoryPicker && (
              <View style={styles.pickerDropdown}>
                {GOAL_CATEGORIES.map((cat) => (
                  <TouchableOpacity
                    key={cat}
                    style={styles.pickerOption}
                    onPress={() => {
                      setForm((prev) => ({ ...prev, category: cat }));
                      setShowCategoryPicker(false);
                    }}
                  >
                    <Text style={styles.pickerOptionText}>{cat}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Target Value & Unit */}
          <View style={styles.rowSection}>
            <View style={[styles.section, { flex: 1, marginRight: SPACING.md }]}>
              <Text style={styles.label}>Target Value *</Text>
              <TextInput
                style={styles.textInput}
                placeholder="100"
                placeholderTextColor={LIGHT_THEME.textTertiary}
                value={form.targetValue}
                onChangeText={(value) =>
                  setForm((prev) => ({ ...prev, targetValue: value }))
                }
                keyboardType="decimal-pad"
              />
            </View>
            <View style={[styles.section, { flex: 1 }]}>
              <Text style={styles.label}>Unit *</Text>
              <TextInput
                style={styles.textInput}
                placeholder="km, days, etc"
                placeholderTextColor={LIGHT_THEME.textTertiary}
                value={form.unit}
                onChangeText={(value) =>
                  setForm((prev) => ({ ...prev, unit: value }))
                }
              />
            </View>
          </View>

          {/* Display Type */}
          <View style={styles.section}>
            <Text style={styles.label}>Display Type</Text>
            <TouchableOpacity
              style={styles.pickerButton}
              onPress={() => setShowDisplayTypePicker(!showDisplayTypePicker)}
            >
              <Text style={styles.pickerButtonText}>
                {GOAL_DISPLAY_TYPES.find((t) => t.value === form.displayType)?.label}
              </Text>
              <MaterialCommunityIcons
                name={showDisplayTypePicker ? 'chevron-up' : 'chevron-down'}
                size={20}
                color={LIGHT_THEME.textSecondary}
              />
            </TouchableOpacity>
            {showDisplayTypePicker && (
              <View style={styles.pickerDropdown}>
                {GOAL_DISPLAY_TYPES.map((type) => (
                  <TouchableOpacity
                    key={type.value}
                    style={styles.pickerOption}
                    onPress={() => {
                      setForm((prev) => ({ ...prev, displayType: type.value }));
                      setShowDisplayTypePicker(false);
                    }}
                  >
                    <Text style={styles.pickerOptionText}>{type.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Color Picker */}
          <View style={styles.section}>
            <Text style={styles.label}>Color</Text>
            <View style={styles.colorPicker}>
              {ACCENT_COLORS.map((color) => (
                <TouchableOpacity
                  key={color.value}
                  style={[
                    styles.colorOption,
                    { backgroundColor: color.value },
                    form.color === color.value && styles.colorOptionSelected,
                  ]}
                  onPress={() =>
                    setForm((prev) => ({ ...prev, color: color.value }))
                  }
                >
                  {form.color === color.value && (
                    <MaterialCommunityIcons
                      name="check"
                      size={16}
                      color={LIGHT_THEME.textInverse}
                    />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Update Progress - Only for existing goals */}
          {!isNewGoal && initialGoal && (
            <View style={styles.section}>
              <Text style={styles.label}>Update Progress</Text>
              <Text style={styles.subtext}>
                Current: {initialGoal.currentValue} / {initialGoal.targetValue} {initialGoal.unit}
              </Text>

              {/* Progress preview */}
              {form.displayType === 'gauge' && (
                <GaugeIndicator
                  current={initialGoal.currentValue}
                  target={initialGoal.targetValue}
                  unit={initialGoal.unit}
                  color={form.color}
                  size={120}
                />
              )}
              {form.displayType === 'bar' && (
                <ProgressBar
                  current={initialGoal.currentValue}
                  target={initialGoal.targetValue}
                  unit={initialGoal.unit}
                  color={form.color}
                  showLabel={true}
                />
              )}

              <View style={styles.progressInputRow}>
                <TextInput
                  style={[styles.textInput, { flex: 1 }]}
                  placeholder="New progress value"
                  placeholderTextColor={LIGHT_THEME.textTertiary}
                  value={progressValue}
                  onChangeText={setProgressValue}
                  keyboardType="decimal-pad"
                />
                <TouchableOpacity
                  style={styles.updateButton}
                  onPress={handleUpdateProgress}
                >
                  <Text style={styles.updateButtonText}>Update</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      <LoadingOverlay visible={loading} />
      </KeyboardAvoidingView>
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
  scrollContent: {
    paddingBottom: SPACING.xl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: LIGHT_THEME.border,
  },
  title: {
    ...TEXT_STYLES.heading3,
    color: LIGHT_THEME.text,
    flex: 1,
    textAlign: 'center',
  },
  saveButton: {
    ...TEXT_STYLES.labelLarge,
    color: LIGHT_THEME.accentTeal,
  },
  form: {
    padding: SPACING.lg,
  },
  section: {
    marginBottom: SPACING.lg,
  },
  rowSection: {
    flexDirection: 'row',
    marginBottom: SPACING.lg,
  },
  label: {
    ...TEXT_STYLES.labelLarge,
    color: LIGHT_THEME.text,
    marginBottom: SPACING.sm,
  },
  subtext: {
    ...TEXT_STYLES.bodySmall,
    color: LIGHT_THEME.textSecondary,
    marginBottom: SPACING.md,
  },
  textInput: {
    borderWidth: 1,
    borderColor: LIGHT_THEME.border,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    ...TEXT_STYLES.body,
    color: LIGHT_THEME.text,
  },
  pickerButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: LIGHT_THEME.border,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
  },
  pickerButtonText: {
    ...TEXT_STYLES.body,
    color: LIGHT_THEME.text,
  },
  pickerDropdown: {
    borderWidth: 1,
    borderColor: LIGHT_THEME.border,
    borderRadius: BORDER_RADIUS.md,
    marginTop: SPACING.sm,
    backgroundColor: LIGHT_THEME.backgroundSecondary,
  },
  pickerOption: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: LIGHT_THEME.border,
  },
  pickerOptionText: {
    ...TEXT_STYLES.body,
    color: LIGHT_THEME.text,
  },
  colorPicker: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
  },
  colorOption: {
    width: 50,
    height: 50,
    borderRadius: BORDER_RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  colorOptionSelected: {
    borderWidth: 3,
    borderColor: LIGHT_THEME.text,
  },
  progressInputRow: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginTop: SPACING.md,
  },
  updateButton: {
    backgroundColor: LIGHT_THEME.accentOrange,
    paddingHorizontal: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  updateButtonText: {
    ...TEXT_STYLES.button,
    color: LIGHT_THEME.textInverse,
  },
});

export default GoalDetailScreen;
