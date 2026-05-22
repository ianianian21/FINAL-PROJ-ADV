/**
 * ImagePickerInput Component
 * Cross-platform image picker that works on web and native
 */

import React, { useRef } from 'react';
import { TouchableOpacity, Text, StyleSheet, Alert, ActivityIndicator, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { isWeb } from '../utils/platform';
import { TEXT_STYLES } from '../constants/typography';
import { SPACING, BORDER_RADIUS } from '../constants/theme';
import { useTheme } from '../hooks/useTheme';

interface ImagePickerInputProps {
  onImageSelected: (base64: string) => void;
  isLoading?: boolean;
  label?: string;
}

const ImagePickerInput: React.FC<ImagePickerInputProps> = ({
  onImageSelected,
  isLoading = false,
  label = 'Change Picture',
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const theme = useTheme();

  /**
   * Handle web file input change
   */
  const handleWebFileChange = (event: any) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      Alert.alert('Error', 'Please select a valid image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      Alert.alert('Error', 'Image must be smaller than 5MB');
      return;
    }

    // Read file as base64
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result as string;
      onImageSelected(base64);
    };
    reader.onerror = () => {
      Alert.alert('Error', 'Failed to read image file');
    };
    reader.readAsDataURL(file);

    // Reset input so same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  /**
   * Handle native image picker
   */
  const handleNativeImagePicker = async () => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('Permission needed', 'Please allow access to your photo library');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
        base64: true,
      });

      if (!result.canceled && result.assets[0].base64) {
        const base64Image = `data:image/jpeg;base64,${result.assets[0].base64}`;
        onImageSelected(base64Image);
      }
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to pick image');
    }
  };

  /**
   * Trigger file picker on web or native picker
   */
  const handlePress = () => {
    if (isWeb()) {
      fileInputRef.current?.click();
    } else {
      handleNativeImagePicker();
    }
  };

  if (isLoading) {
    return (
      <View style={[styles.button, { backgroundColor: theme.backgroundSecondary }]}>
        <ActivityIndicator color={theme.accentTeal} size="small" />
        <Text style={[styles.buttonText, { color: theme.text }]}>Uploading...</Text>
      </View>
    );
  }

  return (
    <>
      <TouchableOpacity
        style={[styles.button, { backgroundColor: theme.accentTeal }]}
        onPress={handlePress}
        disabled={isLoading}
      >
        <MaterialCommunityIcons name="camera" size={20} color={theme.textInverse} />
        <Text style={[styles.buttonText, { color: theme.textInverse }]}>{label}</Text>
      </TouchableOpacity>

      {/* Hidden file input for web */}
      {isWeb() && (
        <input
          ref={fileInputRef as any}
          type="file"
          accept="image/*"
          onChange={handleWebFileChange}
          style={{ display: 'none' }}
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
    gap: SPACING.sm,
  },
  buttonText: {
    ...TEXT_STYLES.label,
  },
});

export default ImagePickerInput;