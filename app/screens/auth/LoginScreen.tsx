/**
 * LoginScreen
 * Authentication screen for existing users to sign in
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../types';
import { useAppContext } from '../../hooks/useAppContext';
import { validateEmail, validatePassword } from '../../utils/validation';
import { useTheme } from '../../hooks/useTheme';
import { LIGHT_THEME } from '../../constants/colors';
import { TEXT_STYLES } from '../../constants/typography';
import { SPACING, BORDER_RADIUS } from '../../constants/theme';
import LoadingOverlay from '../../components/LoadingOverlay';
import { resetPassword } from '../../firebase/auth';

type LoginScreenProps = NativeStackScreenProps<AuthStackParamList, 'Login'>;

interface FormState {
  email: string;
  password: string;
  showPassword: boolean;
}

interface FormErrors {
  email?: string;
  password?: string;
  general?: string;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const { signIn, loading } = useAppContext();
  const theme = useTheme();
  const [form, setForm] = useState<FormState>({
    email: '',
    password: '',
    showPassword: false,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [isResettingPassword, setIsResettingPassword] = useState(false);

  /**
   * Validate form before submission
   */
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    const emailError = validateEmail(form.email);
    if (emailError) newErrors.email = emailError;

    const passwordError = validatePassword(form.password);
    if (passwordError) newErrors.password = passwordError;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handle sign in button press
   */
  const handleSignIn = async () => {
    try {
      // Validate form
      if (!validateForm()) return;

      setIsSubmitting(true);
      await signIn(form.email, form.password);

      // Success - navigation will happen automatically when auth state changes
      setForm({ email: '', password: '', showPassword: false });
    } catch (error: any) {
      setErrors({
        ...errors,
        general: error.message || 'Sign in failed. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Handle forgot password
   */
  const handleForgotPassword = async () => {
    if (!resetEmail.trim()) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }

    try {
      setIsResettingPassword(true);
      await resetPassword(resetEmail);
      Alert.alert(
        'Success',
        'Password reset email sent! Check your email for instructions.',
        [{ text: 'OK', onPress: () => setShowForgotPassword(false) }]
      );
      setResetEmail('');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to send reset email');
    } finally {
      setIsResettingPassword(false);
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
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header */}
        <View style={styles.header}>
          <MaterialCommunityIcons
            name="check-circle"
            size={64}
            color={theme.accentTeal}
            style={styles.logo}
          />
          <Text style={[styles.title, { color: theme.text }]}>Welcome to Taskly</Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
            Sign in to manage your tasks and goals
          </Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          {/* Email input */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.text }]}>Email Address</Text>
            <View
              style={[
                styles.inputContainer,
                { backgroundColor: theme.backgroundSecondary, borderColor: theme.border },
                errors.email && { borderColor: theme.error },
              ]}
            >
              <MaterialCommunityIcons
                name="email"
                size={20}
                color={theme.textSecondary}
                style={styles.inputIcon}
              />
              <TextInput
                style={[styles.input, { color: theme.text }]}
                placeholder="Enter your email"
                placeholderTextColor={theme.textTertiary}
                value={form.email}
                onChangeText={(value) => handleInputChange('email', value)}
                editable={!isSubmitting}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>
            {errors.email && (
              <Text style={[styles.errorText, { color: theme.error }]}>{errors.email}</Text>
            )}
          </View>

          {/* Password input */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.text }]}>Password</Text>
            <View
              style={[
                styles.inputContainer,
                { backgroundColor: theme.backgroundSecondary, borderColor: theme.border },
                errors.password && { borderColor: theme.error },
              ]}
            >
              <MaterialCommunityIcons
                name="lock"
                size={20}
                color={theme.textSecondary}
                style={styles.inputIcon}
              />
              <TextInput
                style={[styles.input, { color: theme.text }]}
                placeholder="Enter your password"
                placeholderTextColor={theme.textTertiary}
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
                  color={theme.textSecondary}
                />
              </TouchableOpacity>
            </View>
            {errors.password && (
              <Text style={[styles.errorText, { color: theme.error }]}>{errors.password}</Text>
            )}
          </View>

          {/* General error message */}
          {errors.general && (
            <View style={[styles.generalError, { backgroundColor: theme.error + '10', borderLeftColor: theme.error }]}>
              <MaterialCommunityIcons
                name="alert-circle"
                size={16}
                color={theme.error}
              />
              <Text style={[styles.generalErrorText, { color: theme.error }]}>{errors.general}</Text>
            </View>
          )}

          {/* Sign in button */}
          <TouchableOpacity
            style={[styles.button, { backgroundColor: theme.accentTeal }, isSubmitting && styles.buttonDisabled]}
            onPress={handleSignIn}
            disabled={isSubmitting || loading}
          >
            <Text style={[styles.buttonText, { color: theme.textInverse }]}>
              {isSubmitting ? 'Signing in...' : 'Sign In'}
            </Text>
          </TouchableOpacity>

          {/* Forgot password link */}
          <View style={styles.linksContainer}>
            <TouchableOpacity
              onPress={() => setShowForgotPassword(true)}
              disabled={isSubmitting}
            >
              <Text style={[styles.forgotPasswordLink, { color: theme.accentTeal }]}>
                Forgot password?
              </Text>
            </TouchableOpacity>
          </View>

          {/* Sign up link */}
          <View style={styles.footer}>
            <Text style={[styles.footerText, { color: theme.textSecondary }]}>
              Don't have an account?{' '}
            </Text>
            <TouchableOpacity
              onPress={() => navigation.replace('Register')}
              disabled={isSubmitting}
            >
              <Text style={[styles.footerLink, { color: theme.accentTeal }]}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Forgot Password Modal */}
        {showForgotPassword && (
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContent, { backgroundColor: theme.background }]}>
              <View style={styles.modalHeader}>
                <Text style={[styles.modalTitle, { color: theme.text }]}>Reset Password</Text>
                <TouchableOpacity
                  onPress={() => {
                    setShowForgotPassword(false);
                    setResetEmail('');
                  }}
                >
                  <MaterialCommunityIcons
                    name="close"
                    size={24}
                    color={theme.text}
                  />
                </TouchableOpacity>
              </View>

              <Text style={[styles.modalDescription, { color: theme.textSecondary }]}>
                Enter your email address and we'll send you a link to reset your password.
              </Text>

              <View style={styles.modalInputGroup}>
                <View
                  style={[
                    styles.modalInputContainer,
                    { backgroundColor: theme.backgroundSecondary, borderColor: theme.border },
                  ]}
                >
                  <MaterialCommunityIcons
                    name="email"
                    size={20}
                    color={theme.textSecondary}
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={[styles.modalInput, { color: theme.text }]}
                    placeholder="Enter your email"
                    placeholderTextColor={theme.textTertiary}
                    value={resetEmail}
                    onChangeText={setResetEmail}
                    editable={!isResettingPassword}
                    autoCapitalize="none"
                    keyboardType="email-address"
                  />
                </View>
              </View>

              <TouchableOpacity
                style={[
                  styles.modalButton,
                  { backgroundColor: theme.accentTeal },
                  isResettingPassword && styles.buttonDisabled,
                ]}
                onPress={handleForgotPassword}
                disabled={isResettingPassword}
              >
                <Text style={[styles.modalButtonText, { color: theme.textInverse }]}>
                  {isResettingPassword ? 'Sending...' : 'Send Reset Email'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  setShowForgotPassword(false);
                  setResetEmail('');
                }}
                disabled={isResettingPassword}
              >
                <Text style={[styles.modalCancelButton, { color: theme.textSecondary }]}>
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Loading overlay */}
      <LoadingOverlay visible={loading} message="Signing in..." />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.xl,
    justifyContent: 'center',
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
    marginBottom: SPACING.md,
    lineHeight: 36,
  },
  subtitle: {
    ...TEXT_STYLES.body,
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
    marginBottom: SPACING.sm,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  inputIcon: {
    marginRight: SPACING.md,
  },
  input: {
    flex: 1,
    ...TEXT_STYLES.body,
    paddingVertical: 0,
  },
  errorText: {
    ...TEXT_STYLES.caption,
    marginTop: SPACING.xs,
  },
  generalError: {
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftWidth: 4,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.sm,
    marginBottom: SPACING.lg,
  },
  generalErrorText: {
    ...TEXT_STYLES.body,
    marginLeft: SPACING.md,
    flex: 1,
  },
  button: {
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
  },
  linksContainer: {
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  forgotPasswordLink: {
    ...TEXT_STYLES.label,
    textDecorationLine: 'underline',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    ...TEXT_STYLES.body,
  },
  footerLink: {
    ...TEXT_STYLES.body,
    fontFamily: TEXT_STYLES.labelLarge.fontFamily,
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  modalContent: {
    width: '85%',
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    maxWidth: 400,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  modalTitle: {
    ...TEXT_STYLES.heading3,
  },
  modalDescription: {
    ...TEXT_STYLES.body,
    marginBottom: SPACING.md,
    lineHeight: 20,
  },
  modalInputGroup: {
    marginBottom: SPACING.lg,
  },
  modalInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  modalInput: {
    flex: 1,
    ...TEXT_STYLES.body,
    paddingVertical: 0,
  },
  modalButton: {
    borderRadius: BORDER_RADIUS.md,
    paddingVertical: SPACING.md,
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  modalButtonText: {
    ...TEXT_STYLES.button,
  },
  modalCancelButton: {
    ...TEXT_STYLES.label,
    textAlign: 'center',
  },
});

export default LoginScreen;