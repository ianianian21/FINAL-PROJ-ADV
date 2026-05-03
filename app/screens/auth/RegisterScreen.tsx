/**
 * RegisterScreen
 * Authentication screen for new users to create an account
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../types';
import { useAppContext } from '../../hooks/useAppContext';
import {
  validateEmail,
  validatePassword,
  validatePasswordMatch,
} from '../../utils/validation';
import { LIGHT_THEME } from '../../constants/colors';
import { TEXT_STYLES } from '../../constants/typography';
import { SPACING, BORDER_RADIUS } from '../../constants/theme';
import LoadingOverlay from '../../components/LoadingOverlay';

type RegisterScreenProps = NativeStackScreenProps<AuthStackParamList, 'Register'>;

interface FormState {
  displayName: string;
  email: string;
  password: string;
  confirmPassword: string;
  showPassword: boolean;
  showConfirmPassword: boolean;
}

interface FormErrors {
  displayName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  general?: string;
}

const RegisterScreen: React.FC<RegisterScreenProps> = ({ navigation }) => {
  const { signUp, loading } = useAppContext();
  const [form, setForm] = useState<FormState>({
    displayName: '',
    email: '',
    password: '',
    confirmPassword: '',
    showPassword: false,
    showConfirmPassword: false,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * Validate form before submission
   */
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Validate display name
    if (!form.displayName.trim()) {
      newErrors.displayName = 'Display name is required';
    } else if (form.displayName.trim().length < 2) {
      newErrors.displayName = 'Display name must be at least 2 characters';
    }

    // Validate email
    const emailError = validateEmail(form.email);
    if (emailError) newErrors.email = emailError;

    // Validate password
    const passwordError = validatePassword(form.password);
    if (passwordError) newErrors.password = passwordError;

    // Validate password confirmation
    const confirmError = validatePasswordMatch(
      form.password,
      form.confirmPassword
    );
    if (confirmError) newErrors.confirmPassword = confirmError;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handle sign up button press
   */
  const handleSignUp = async () => {
    try {
      // Validate form
      if (!validateForm()) return;

      setIsSubmitting(true);
      await signUp(form.email, form.password, form.displayName);

      // Success - navigation will happen automatically when auth state changes
      setForm({
        displayName: '',
        email: '',
        password: '',
        confirmPassword: '',
        showPassword: false,
        showConfirmPassword: false,
      });
    } catch (error: any) {
      setErrors({
        ...errors,
        general: error.message || 'Sign up failed. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Handle input change
   */
  const handleInputChange = (key: keyof FormState, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    // Clear error for this field when user starts typing
    if (errors[key as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [key]: undefined }));
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header */}
        <View style={styles.header}>
          <MaterialCommunityIcons
            name="plus-circle"
            size={64}
            color={LIGHT_THEME.accentTeal}
            style={styles.logo}
          />
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join Taskly and start organizing your life</Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          {/* Display Name input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Display Name</Text>
            <View
              style={[
                styles.inputContainer,
                errors.displayName && styles.inputError,
              ]}
            >
              <MaterialCommunityIcons
                name="account"
                size={20}
                color={LIGHT_THEME.textSecondary}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Enter your name"
                placeholderTextColor={LIGHT_THEME.textTertiary}
                value={form.displayName}
                onChangeText={(value) => handleInputChange('displayName', value)}
                editable={!isSubmitting}
              />
            </View>
            {errors.displayName && (
              <Text style={styles.errorText}>{errors.displayName}</Text>
            )}
          </View>

          {/* Email input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email Address</Text>
            <View
              style={[
                styles.inputContainer,
                errors.email && styles.inputError,
              ]}
            >
              <MaterialCommunityIcons
                name="email"
                size={20}
                color={LIGHT_THEME.textSecondary}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                placeholderTextColor={LIGHT_THEME.textTertiary}
                value={form.email}
                onChangeText={(value) => handleInputChange('email', value)}
                editable={!isSubmitting}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>
            {errors.email && (
              <Text style={styles.errorText}>{errors.email}</Text>
            )}
          </View>

          {/* Password input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <View
              style={[
                styles.inputContainer,
                errors.password && styles.inputError,
              ]}
            >
              <MaterialCommunityIcons
                name="lock"
                size={20}
                color={LIGHT_THEME.textSecondary}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Create a password"
                placeholderTextColor={LIGHT_THEME.textTertiary}
                value={form.password}
                onChangeText={(value) => handleInputChange('password', value)}
                editable={!isSubmitting}
                secureTextEntry={!form.showPassword}
              />
              <TouchableOpacity
                onPress={() =>
                  handleInputChange('showPassword', !form.showPassword)
                }
              >
                <MaterialCommunityIcons
                  name={form.showPassword ? 'eye-off' : 'eye'}
                  size={20}
                  color={LIGHT_THEME.textSecondary}
                />
              </TouchableOpacity>
            </View>
            {errors.password && (
              <Text style={styles.errorText}>{errors.password}</Text>
            )}
          </View>

          {/* Confirm Password input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Confirm Password</Text>
            <View
              style={[
                styles.inputContainer,
                errors.confirmPassword && styles.inputError,
              ]}
            >
              <MaterialCommunityIcons
                name="lock"
                size={20}
                color={LIGHT_THEME.textSecondary}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Confirm your password"
                placeholderTextColor={LIGHT_THEME.textTertiary}
                value={form.confirmPassword}
                onChangeText={(value) =>
                  handleInputChange('confirmPassword', value)
                }
                editable={!isSubmitting}
                secureTextEntry={!form.showConfirmPassword}
              />
              <TouchableOpacity
                onPress={() =>
                  handleInputChange('showConfirmPassword', !form.showConfirmPassword)
                }
              >
                <MaterialCommunityIcons
                  name={form.showConfirmPassword ? 'eye-off' : 'eye'}
                  size={20}
                  color={LIGHT_THEME.textSecondary}
                />
              </TouchableOpacity>
            </View>
            {errors.confirmPassword && (
              <Text style={styles.errorText}>{errors.confirmPassword}</Text>
            )}
          </View>

          {/* General error message */}
          {errors.general && (
            <View style={styles.generalError}>
              <MaterialCommunityIcons
                name="alert-circle"
                size={16}
                color={LIGHT_THEME.error}
              />
              <Text style={styles.generalErrorText}>{errors.general}</Text>
            </View>
          )}

          {/* Sign up button */}
          <TouchableOpacity
            style={[styles.button, isSubmitting && styles.buttonDisabled]}
            onPress={handleSignUp}
            disabled={isSubmitting || loading}
          >
            <Text style={styles.buttonText}>
              {isSubmitting ? 'Creating Account...' : 'Create Account'}
            </Text>
          </TouchableOpacity>

          {/* Sign in link */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity
              onPress={() => navigation.replace('Login')}
              disabled={isSubmitting}
            >
              <Text style={styles.footerLink}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Loading overlay */}
      <LoadingOverlay visible={loading} message="Creating account..." />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: LIGHT_THEME.background,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.xl,
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING['2xl'],
  },
  logo: {
    marginBottom: SPACING.lg,
  },
  title: {
    ...TEXT_STYLES.heading1,
    color: LIGHT_THEME.text,
    marginBottom: SPACING.md,
    lineHeight: 36,
  },
  subtitle: {
    ...TEXT_STYLES.body,
    color: LIGHT_THEME.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  form: {
    marginBottom: SPACING.xl,
  },
  inputGroup: {
    marginBottom: SPACING.lg,
  },
  label: {
    ...TEXT_STYLES.labelLarge,
    color: LIGHT_THEME.text,
    marginBottom: SPACING.sm,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: LIGHT_THEME.border,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    backgroundColor: LIGHT_THEME.backgroundSecondary,
  },
  inputError: {
    borderColor: LIGHT_THEME.error,
  },
  inputIcon: {
    marginRight: SPACING.md,
  },
  input: {
    flex: 1,
    ...TEXT_STYLES.body,
    color: LIGHT_THEME.text,
    paddingVertical: 0,
  },
  errorText: {
    ...TEXT_STYLES.caption,
    color: LIGHT_THEME.error,
    marginTop: SPACING.xs,
  },
  generalError: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: LIGHT_THEME.error + '10',
    borderLeftWidth: 4,
    borderLeftColor: LIGHT_THEME.error,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.sm,
    marginBottom: SPACING.lg,
  },
  generalErrorText: {
    ...TEXT_STYLES.body,
    color: LIGHT_THEME.error,
    marginLeft: SPACING.md,
    flex: 1,
  },
  button: {
    backgroundColor: LIGHT_THEME.accentTeal,
    borderRadius: BORDER_RADIUS.md,
    paddingVertical: SPACING.md,
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    ...TEXT_STYLES.button,
    color: LIGHT_THEME.textInverse,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    ...TEXT_STYLES.body,
    color: LIGHT_THEME.textSecondary,
  },
  footerLink: {
    ...TEXT_STYLES.body,
    color: LIGHT_THEME.accentTeal,
    fontFamily: TEXT_STYLES.labelLarge.fontFamily,
  },
});

export default RegisterScreen;
