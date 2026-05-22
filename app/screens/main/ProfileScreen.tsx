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
  Image,
  ActivityIndicator,
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
import ImagePickerInput from '../../components/ImagePickerInput';
import { updateUserProfile } from '../../firebase/firestore';
import { processProfilePicture } from '../../firebase/storage';

type ProfileScreenProps = BottomTabScreenProps<MainTabParamList, 'Profile'>;

const ProfileScreen: React.FC<ProfileScreenProps> = () => {
  const { user, signOut, toggleTheme, loading, refreshUser } = useAppContext();
  const theme = useTheme();
  const [isSigning, setIsSigning] = useState(false);
  const [isUpdatingPicture, setIsUpdatingPicture] = useState(false);

  /**
   * Handle profile picture change from web or mobile
   */
  const handleChangeProfilePicture = async (base64Image: string) => {
    try {
      setIsUpdatingPicture(true);
      
      // Process and validate image
      const pictureToStore = await processProfilePicture(base64Image);
      
      // Save to Firestore
      if (user?.uid) {
        await updateUserProfile(user.uid, {
          profilePicture: pictureToStore,
        });
        
        // Refresh user data
        await refreshUser?.();
        Alert.alert('Success', 'Profile picture updated!');
      }
    } catch (err: any) {
      console.error('Error updating profile picture:', err);
      Alert.alert('Error', err.message || 'Failed to update profile picture');
    } finally {
      setIsUpdatingPicture(false);
    }
  };

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
      <View style={[styles.userCard, { backgroundColor: theme.backgroundSecondary }]}>
        {/* Avatar */}
        <View style={styles.avatarContainer}>
          {user?.profilePicture ? (
            <Image
              source={{ uri: user.profilePicture }}
              style={styles.avatarImage}
            />
          ) : (
            <View style={[styles.avatarPlaceholder, { backgroundColor: theme.backgroundTertiary }]}>
              <MaterialCommunityIcons
                name="account-circle"
                size={64}
                color={theme.accentTeal}
              />
            </View>
          )}
        </View>

        <Text style={[styles.displayName, { color: theme.text }]}>
          {user?.displayName || 'User'}
        </Text>
        <Text style={[styles.email, { color: theme.textSecondary }]}>
          {user?.email}
        </Text>
        <View style={[styles.memberBadge, { backgroundColor: theme.success + '10' }]}>
          <MaterialCommunityIcons
            name="check-circle"
            size={14}
            color={theme.success}
          />
          <Text style={[styles.memberText, { color: theme.success }]}>
            Member since {user?.createdAt ? new Date(user.createdAt).getFullYear() : '2024'}
          </Text>
        </View>

        {/* Image Picker Button */}
        <View style={styles.imagePickerContainer}>
          <ImagePickerInput
            onImageSelected={handleChangeProfilePicture}
            isLoading={isUpdatingPicture}
            label="Change Picture"
          />
        </View>
      </View>

      {/* Settings Sections */}
      <View style={styles.settingsSection}>
        <Text style={[styles.settingsSectionTitle, { color: theme.textSecondary }]}>
          Preferences
        </Text>

        {/* Theme Toggle */}
        <View style={[styles.settingItem, { backgroundColor: theme.backgroundSecondary }]}>
          <View style={styles.settingLabelContainer}>
            <MaterialCommunityIcons
              name={user?.theme === 'dark' ? 'moon-waning-crescent' : 'white-balance-sunny'}
              size={20}
              color={theme.accentOrange}
            />
            <View style={styles.settingLabel}>
              <Text style={[styles.settingLabelText, { color: theme.text }]}>
                Dark Mode
              </Text>
              <Text style={[styles.settingLabelSubtext, { color: theme.textSecondary }]}>
                Currently {user?.theme === 'dark' ? 'enabled' : 'disabled'}
              </Text>
            </View>
          </View>
          <Switch
            value={user?.theme === 'dark'}
            onValueChange={handleToggleTheme}
            trackColor={{
              false: theme.border,
              true: theme.accentTeal,
            }}
            thumbColor={
              user?.theme === 'dark' ? theme.accentTeal : theme.border
            }
          />
        </View>
      </View>

      {/* About Section */}
      <View style={styles.settingsSection}>
        <Text style={[styles.settingsSectionTitle, { color: theme.textSecondary }]}>
          About
        </Text>

        <View style={[styles.settingItem, { backgroundColor: theme.backgroundSecondary }]}>
          <View style={styles.settingLabelContainer}>
            <MaterialCommunityIcons
              name="information"
              size={20}
              color={theme.accentBlue}
            />
            <View style={styles.settingLabel}>
              <Text style={[styles.settingLabelText, { color: theme.text }]}>
                App Version
              </Text>
              <Text style={[styles.settingLabelSubtext, { color: theme.textSecondary }]}>
                1.0.0
              </Text>
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.settingItem, { backgroundColor: theme.backgroundSecondary }]}
          onPress={() => Alert.alert('Privacy', 'Privacy policy would be displayed here')}
        >
          <View style={styles.settingLabelContainer}>
            <MaterialCommunityIcons
              name="shield"
              size={20}
              color={theme.accentGreen}
            />
            <View style={styles.settingLabel}>
              <Text style={[styles.settingLabelText, { color: theme.text }]}>
                Privacy Policy
              </Text>
            </View>
          </View>
          <MaterialCommunityIcons
            name="chevron-right"
            size={20}
            color={theme.textTertiary}
          />
        </TouchableOpacity>
      </View>

      {/* Sign Out Section */}
      <View style={styles.signOutSection}>
        <TouchableOpacity
          style={[styles.signOutButton, { borderColor: theme.error + '30', backgroundColor: theme.error + '10' }]}
          onPress={handleSignOut}
          disabled={isSigning || loading}
        >
          <MaterialCommunityIcons
            name="logout"
            size={20}
            color={theme.error}
          />
          <Text style={[styles.signOutButtonText, { color: theme.error }]}>
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
  },
  container: {
    flex: 1,
  },
  userCard: {
    alignItems: 'center',
    paddingVertical: SPACING.xl,
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  avatarContainer: {
    marginBottom: SPACING.md,
  },
  avatarImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  displayName: {
    ...TEXT_STYLES.heading2,
    marginBottom: SPACING.xs,
  },
  email: {
    ...TEXT_STYLES.bodySmall,
    marginBottom: SPACING.md,
  },
  memberBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.full,
    marginBottom: SPACING.md,
  },
  memberText: {
    ...TEXT_STYLES.caption,
    marginLeft: SPACING.sm,
  },
  imagePickerContainer: {
    width: '100%',
  },
  settingsSection: {
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  settingsSectionTitle: {
    ...TEXT_STYLES.labelLarge,
    marginBottom: SPACING.md,
    textTransform: 'uppercase',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
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
  },
  settingLabelSubtext: {
    ...TEXT_STYLES.caption,
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
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
  },
  signOutButtonText: {
    ...TEXT_STYLES.button,
    marginLeft: SPACING.md,
  },
});

export default ProfileScreen;