/**
 * LoadingOverlay Component
 * Full-screen loading indicator with backdrop
 */

import React from 'react';
import {
  View,
  ActivityIndicator,
  StyleSheet,
  Modal,
  Text,
} from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { LIGHT_THEME } from '../constants/colors';
import { TEXT_STYLES } from '../constants/typography';


interface LoadingOverlayProps {
  visible: boolean;
  message?: string;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  visible,
  message = 'Loading...',
}) => {
  const theme = useTheme();
  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      statusBarTranslucent
    >
      <View style={styles.container}>
        <View style={styles.backdrop} />
        <View style={styles.content}>
          <ActivityIndicator
            size="large"
            color={theme.accentTeal}
          />
          {message && (
            <Text style={styles.message}>{message}</Text>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: LIGHT_THEME.overlay,
  },
  content: {
    alignItems: 'center',
    zIndex: 1,
  },
  message: {
    ...TEXT_STYLES.body,
    color: LIGHT_THEME.text,
    marginTop: 16,
  },
});

export default LoadingOverlay;
