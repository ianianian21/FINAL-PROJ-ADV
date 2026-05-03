/**
 * ProfileScreen - User profile, theme toggle, and sign out
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { MainTabParamList } from '../../types';
import { useAppContext } from '../../hooks/useAppContext';
import { useTheme } from '../../hooks/useTheme';
import { LIGHT_THEME } from '../../constants/colors';
import { TEXT_STYLES } from '../../constants/typography';
import { SPACING, BORDER_RADIUS } from '../../constants/theme';
import LoadingOverlay from '../../components/LoadingOverlay';

type ProfileScreenProps = BottomTabScreenProps<MainTabParamList, 'Profile'>;

const ProfileScreen: React.FC<ProfileScreenProps> = () => {
  const { user, signOut, toggleTheme, loading } = useAppContext();
  const theme = useTheme();
  const [isSigning, setIsSigning] = useState(false);

  /**
   * Handle sign out
   */
  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', onPress: () => {} },
        {
          text: 'Sign Out',
          onPress: async () => {
            try {
              setIsSigning(true);
              await signOut();
            } catch (err: any) {
              Alert.alert('Error', err.message);
            } finally {
              setIsSigning(false);
            }
          },
          style: 'destructive',
        },
      ]
    );
  };

  /**
   * Handle theme toggle
   */
  const handleToggleTheme = async () => {
    try {
      await toggleTheme();
    } catch (err: any) {
      Alert.alert('Error', err.message);
    }
  };

  return (
    <SafeAreaView style={[styles.containerSafe, { backgroundColor: theme.background }]} edges={['top', 'bottom']}>
      <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      {/* User Info Card */}
      <View style={styles.userCard}>
        <View style={styles.avatar}>
          <MaterialCommunityIcons
            name="account-circle"
            size={64}
            color={LIGHT_THEME.accentTeal}
          />
        </View>
        <Text style={styles.displayName}>{user?.displayName || 'User'}</Text>
        <Text style={styles.email}>{user?.email}</Text>
        <View style={styles.memberBadge}>
          <MaterialCommunityIcons
            name="check-circle"
            size={14}
            color={LIGHT_THEME.success}
          />
          <Text style={styles.memberText}>Member since {user?.createdAt ? new Date(user.createdAt).getFullYear() : '2024'}</Text>
        </View>
      </View>

      {/* Settings Sections */}
      <View style={styles.settingsSection}>
        <Text style={styles.settingsSectionTitle}>Preferences</Text>

        {/* Theme Toggle */}
        <View style={styles.settingItem}>
          <View style={styles.settingLabelContainer}>
            <MaterialCommunityIcons
              name={user?.theme === 'dark' ? 'moon-waning-crescent' : 'white-balance-sunny'}
              size={20}
              color={LIGHT_THEME.accentOrange}
            />
            <View style={styles.settingLabel}>
              <Text style={styles.settingLabelText}>Dark Mode</Text>
              <Text style={styles.settingLabelSubtext}>
                Currently {user?.theme === 'dark' ? 'enabled' : 'disabled'}
              </Text>
            </View>
          </View>
          <Switch
            value={user?.theme === 'dark'}
            onValueChange={handleToggleTheme}
            trackColor={{
              false: LIGHT_THEME.border,
              true: LIGHT_THEME.accentTeal,
            }}
            thumbColor={
              user?.theme === 'dark' ? LIGHT_THEME.accentTeal : LIGHT_THEME.border
            }
          />
        </View>
      </View>

      {/* About Section */}
      <View style={styles.settingsSection}>
        <Text style={styles.settingsSectionTitle}>About</Text>

        <View style={styles.settingItem}>
          <View style={styles.settingLabelContainer}>
            <MaterialCommunityIcons
              name="information"
              size={20}
              color={LIGHT_THEME.accentBlue}
            />
            <View style={styles.settingLabel}>
              <Text style={styles.settingLabelText}>App Version</Text>
              <Text style={styles.settingLabelSubtext}>1.0.0</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={styles.settingItem}
          onPress={() => Alert.alert('Privacy', 'Privacy policy would be displayed here')}
        >
          <View style={styles.settingLabelContainer}>
            <MaterialCommunityIcons
              name="shield"
              size={20}
              color={LIGHT_THEME.accentGreen}
            />
            <View style={styles.settingLabel}>
              <Text style={styles.settingLabelText}>Privacy Policy</Text>
            </View>
          </View>
          <MaterialCommunityIcons
            name="chevron-right"
            size={20}
            color={LIGHT_THEME.textTertiary}
          />
        </TouchableOpacity>
      </View>

      {/* Sign Out Section */}
      <View style={styles.signOutSection}>
        <TouchableOpacity
          style={styles.signOutButton}
          onPress={handleSignOut}
          disabled={isSigning || loading}
        >
          <MaterialCommunityIcons
            name="logout"
            size={20}
            color={LIGHT_THEME.error}
          />
          <Text style={styles.signOutButtonText}>
            {isSigning ? 'Signing out...' : 'Sign Out'}
          </Text>
        </TouchableOpacity>
      </View>

      <LoadingOverlay visible={isSigning || loading} message="Processing..." />
      </ScrollView>
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
  userCard: {
    alignItems: 'center',
    paddingVertical: SPACING.xl,
    paddingHorizontal: SPACING.lg,
    backgroundColor: LIGHT_THEME.backgroundSecondary,
    marginBottom: SPACING.lg,
  },
  avatar: {
    marginBottom: SPACING.md,
  },
  displayName: {
    ...TEXT_STYLES.heading2,
    color: LIGHT_THEME.text,
    marginBottom: SPACING.xs,
  },
  email: {
    ...TEXT_STYLES.bodySmall,
    color: LIGHT_THEME.textSecondary,
    marginBottom: SPACING.md,
  },
  memberBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    backgroundColor: LIGHT_THEME.success + '10',
    borderRadius: BORDER_RADIUS.full,
  },
  memberText: {
    ...TEXT_STYLES.caption,
    color: LIGHT_THEME.success,
    marginLeft: SPACING.sm,
  },
  settingsSection: {
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  settingsSectionTitle: {
    ...TEXT_STYLES.labelLarge,
    color: LIGHT_THEME.textSecondary,
    marginBottom: SPACING.md,
    textTransform: 'uppercase',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
    backgroundColor: LIGHT_THEME.backgroundSecondary,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.sm,
  },
  settingLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingLabel: {
    marginLeft: SPACING.md,
    flex: 1,
  },
  settingLabelText: {
    ...TEXT_STYLES.body,
    color: LIGHT_THEME.text,
  },
  settingLabelSubtext: {
    ...TEXT_STYLES.caption,
    color: LIGHT_THEME.textSecondary,
    marginTop: SPACING.xs,
  },
  signOutSection: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xl,
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    backgroundColor: LIGHT_THEME.error + '10',
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: LIGHT_THEME.error + '30',
  },
  signOutButtonText: {
    ...TEXT_STYLES.button,
    color: LIGHT_THEME.error,
    marginLeft: SPACING.md,
  },
});

export default ProfileScreen;
