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
import * as ImagePicker from 'expo-image-picker';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { MainTabParamList } from '../../types';
import { useAppContext } from '../../hooks/useAppContext';
import { useTheme } from '../../hooks/useTheme';
import { LIGHT_THEME } from '../../constants/colors';
import { TEXT_STYLES } from '../../constants/typography';
import { SPACING, BORDER_RADIUS } from '../../constants/theme';
import LoadingOverlay from '../../components/LoadingOverlay';
import { updateUserProfile } from '../../firebase/firestore';
import { processProfilePicture, generateAvatarURL } from '../../firebase/storage';

type ProfileScreenProps = BottomTabScreenProps<MainTabParamList, 'Profile'>;

const ProfileScreen: React.FC<ProfileScreenProps> = () => {
  const { user, signOut, toggleTheme, loading, refreshUser } = useAppContext();
  const theme = useTheme();
  const [isSigning, setIsSigning] = useState(false);
  const [isUpdatingPicture, setIsUpdatingPicture] = useState(false);

  /**
   * Handle profile picture change
   */
  const handleChangeProfilePicture = async () => {
    try {
      // Request permission
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('Permission needed', 'Please allow access to your photo library');
        return;
      }

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
        base64: true,
      });

      if (!result.canceled && result.assets[0].base64) {
        setIsUpdatingPicture(true);
        
        try {
          const base64Image = `data:image/jpeg;base64,${result.assets[0].base64}`;
          
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
      <View style={styles.userCard}>
        {/* Avatar with camera overlay */}
        <TouchableOpacity
          style={styles.avatarContainer}
          onPress={handleChangeProfilePicture}
          disabled={isUpdatingPicture}
        >
          {user?.profilePicture ? (
            <Image
              source={{ uri: user.profilePicture }}
              style={styles.avatarImage}
            />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <MaterialCommunityIcons
                name="account-circle"
                size={64}
                color={LIGHT_THEME.accentTeal}
              />
            </View>
          )}
          
          {/* Camera icon overlay */}
          <View style={styles.cameraOverlay}>
            {isUpdatingPicture ? (
              <ActivityIndicator size="small" color={LIGHT_THEME.background} />
            ) : (
              <MaterialCommunityIcons
                name="camera"
                size={20}
                color={LIGHT_THEME.background}
              />
            )}
          </View>
        </TouchableOpacity>

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
  avatarContainer: {
    position: 'relative',
    marginBottom: SPACING.md,
  },
  avatarImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: LIGHT_THEME.accentTeal,
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: LIGHT_THEME.backgroundTertiary,
  },
  cameraOverlay: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: LIGHT_THEME.accentTeal,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: LIGHT_THEME.backgroundSecondary,
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
