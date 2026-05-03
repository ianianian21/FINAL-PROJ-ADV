/**
 * TaskDetailScreen
 * Create, view, and edit tasks
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
import DateTimePicker from '@react-native-community/datetimepicker';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppStackParamList } from '../../types';
import { createTask, updateTask } from '../../firebase/firestore';
import { useTheme } from '../../hooks/useTheme';
import { LIGHT_THEME } from '../../constants/colors';
import { TEXT_STYLES } from '../../constants/typography';
import { SPACING, BORDER_RADIUS, TASK_CATEGORIES, PRIORITY_LEVELS, ACCENT_COLORS } from '../../constants/theme';
import { formatDate } from '../../utils/dates';
import LoadingOverlay from '../../components/LoadingOverlay';

type TaskDetailScreenProps = NativeStackScreenProps<
  AppStackParamList,
  'TaskDetail'
>;

interface FormState {
  title: string;
  description: string;
  category: string;
  priority: 'low' | 'medium' | 'high';
  color: string;
  dueDate: Date | null;
}

const TaskDetailScreen: React.FC<TaskDetailScreenProps> = ({ route, navigation }) => {
  const theme = useTheme();
  const { taskId, task: initialTask } = route.params;
  const isNewTask = taskId === 'new';

  const [form, setForm] = useState<FormState>({
    title: initialTask?.title || '',
    description: initialTask?.description || '',
    category: initialTask?.category || TASK_CATEGORIES[0],
    priority: initialTask?.priority || 'medium',
    color: initialTask?.color || ACCENT_COLORS[0].value,
    dueDate: initialTask?.dueDate || null,
  });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const [showPriorityPicker, setShowPriorityPicker] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  /**
   * Handle save task
   */
  const handleSave = async () => {
    // Validate
    if (!form.title.trim()) {
      Alert.alert('Error', 'Task title is required');
      return;
    }

    try {
      setIsSaving(true);

      if (isNewTask) {
        await createTask(form);
      } else {
        await updateTask(taskId, form);
      }

      Alert.alert('Success', isNewTask ? 'Task created' : 'Task updated');
      navigation.goBack();
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to save task');
    } finally {
      setIsSaving(false);
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
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <MaterialCommunityIcons
              name="chevron-left"
              size={24}
              color={LIGHT_THEME.text}
            />
          </TouchableOpacity>
          <Text style={styles.title}>
            {isNewTask ? 'New Task' : 'Edit Task'}
          </Text>
          <TouchableOpacity onPress={handleSave} disabled={isSaving}>
            <Text style={styles.saveButton}>
              {isSaving ? 'Saving...' : 'Save'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Form */}
        <View style={styles.form}>
          {/* Title */}
          <View style={styles.section}>
            <Text style={styles.label}>Task Title *</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Enter task title"
              placeholderTextColor={LIGHT_THEME.textTertiary}
              value={form.title}
              onChangeText={(value) =>
                setForm((prev) => ({ ...prev, title: value }))
              }
            />
          </View>

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.textInput, styles.textInputMultiline]}
              placeholder="Enter task description"
              placeholderTextColor={LIGHT_THEME.textTertiary}
              value={form.description}
              onChangeText={(value) =>
                setForm((prev) => ({ ...prev, description: value }))
              }
              multiline
              numberOfLines={3}
            />
          </View>

          {/* Category */}
          <View style={styles.section}>
            <Text style={styles.label}>Category</Text>
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
                {TASK_CATEGORIES.map((cat) => (
                  <TouchableOpacity
                    key={cat}
                    style={styles.pickerOption}
                    onPress={() => {
                      setForm((prev) => ({ ...prev, category: cat }));
                      setShowCategoryPicker(false);
                    }}
                  >
                    <Text
                      style={[
                        styles.pickerOptionText,
                        form.category === cat && styles.pickerOptionTextActive,
                      ]}
                    >
                      {cat}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Priority */}
          <View style={styles.section}>
            <Text style={styles.label}>Priority</Text>
            <TouchableOpacity
              style={styles.pickerButton}
              onPress={() => setShowPriorityPicker(!showPriorityPicker)}
            >
              <Text style={styles.pickerButtonText}>
                {form.priority.charAt(0).toUpperCase() + form.priority.slice(1)}
              </Text>
              <MaterialCommunityIcons
                name={showPriorityPicker ? 'chevron-up' : 'chevron-down'}
                size={20}
                color={LIGHT_THEME.textSecondary}
              />
            </TouchableOpacity>
            {showPriorityPicker && (
              <View style={styles.pickerDropdown}>
                {PRIORITY_LEVELS.map((level) => (
                  <TouchableOpacity
                    key={level.value}
                    style={styles.pickerOption}
                    onPress={() => {
                      setForm((prev) => ({ ...prev, priority: level.value }));
                      setShowPriorityPicker(false);
                    }}
                  >
                    <Text
                      style={[
                        styles.pickerOptionText,
                        form.priority === level.value &&
                          styles.pickerOptionTextActive,
                      ]}
                    >
                      {level.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Due Date */}
          <View style={styles.section}>
            <Text style={styles.label}>Due Date</Text>
            <TouchableOpacity
              style={styles.pickerButton}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={styles.pickerButtonText}>
                {form.dueDate ? formatDate(form.dueDate) : 'Select date'}
              </Text>
              <MaterialCommunityIcons
                name="calendar"
                size={20}
                color={LIGHT_THEME.textSecondary}
              />
            </TouchableOpacity>
            {form.dueDate && (
              <TouchableOpacity
                onPress={() => setForm((prev) => ({ ...prev, dueDate: null }))}
                style={styles.clearButton}
              >
                <Text style={styles.clearButtonText}>Clear date</Text>
              </TouchableOpacity>
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
                    form.color === color.value &&
                      styles.colorOptionSelected,
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
        </View>
      </ScrollView>

      {/* Date Picker Modal */}
      {showDatePicker && (
        <DateTimePicker
          value={form.dueDate || new Date()}
          mode="date"
          display="spinner"
          onChange={(event, selectedDate) => {
            if (event.type === 'set' && selectedDate) {
              setForm((prev) => ({ ...prev, dueDate: selectedDate }));
            }
            setShowDatePicker(false);
          }}
        />
      )}

      <LoadingOverlay visible={isSaving} />
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
  backButton: {
    padding: SPACING.sm,
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
  label: {
    ...TEXT_STYLES.labelLarge,
    color: LIGHT_THEME.text,
    marginBottom: SPACING.sm,
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
  textInputMultiline: {
    height: 100,
    textAlignVertical: 'top',
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
  pickerOptionTextActive: {
    color: LIGHT_THEME.accentTeal,
    fontFamily: TEXT_STYLES.labelLarge.fontFamily,
  },
  clearButton: {
    marginTop: SPACING.sm,
    paddingVertical: SPACING.sm,
  },
  clearButtonText: {
    ...TEXT_STYLES.label,
    color: LIGHT_THEME.error,
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
});

export default TaskDetailScreen;
