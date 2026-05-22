/**
 * Platform detection utility
 * Determines if code is running on web or native
 */

import { Platform } from 'react-native';

export const isWeb = () => Platform.OS === 'web';
export const isNative = () => Platform.OS !== 'web';
export const isIOS = () => Platform.OS === 'ios';
export const isAndroid = () => Platform.OS === 'android';