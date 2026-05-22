/**
 * Image handling service
 * Handles profile picture storage without Firebase Storage
 * Uses free avatar generation + base64 storage
 * Works on both web and native
 */

import { getCurrentUserId } from './auth';

/**
 * Generate avatar URL from user email
 * Uses UI Avatars free service - no API key needed
 */
export const generateAvatarURL = (email: string): string => {
  const encodedEmail = encodeURIComponent(email);
  return `https://ui-avatars.com/api/?name=${encodedEmail}&background=random&bold=true&size=256`;
};

/**
 * Process and store profile picture
 * Stores base64 directly (no server compression needed, already optimized)
 * Firestore allows documents up to 1MB, and compressed images are ~100KB max
 * Works on both web and native
 */
export const processProfilePicture = async (base64Image: string): Promise<string> => {
  try {
    // Validate base64 format
    if (!base64Image || typeof base64Image !== 'string') {
      throw new Error('Invalid image data');
    }

    // Handle data URL format (common on web: data:image/jpeg;base64,...)
    let imageData = base64Image;
    if (base64Image.startsWith('data:')) {
      // Already in data URL format (web)
      imageData = base64Image;
    } else if (!base64Image.startsWith('data:')) {
      // Add data URL prefix for consistency (native)
      imageData = `data:image/jpeg;base64,${base64Image}`;
    }

    // Check base64 size in bytes
    // Base64 is ~33% larger than binary, so we estimate: base64.length * 0.75
    const estimatedBytes = imageData.length * 0.75;
    const sizeInKB = estimatedBytes / 1024;
    
    // Allow up to 500KB
    if (estimatedBytes > 500000) {
      console.warn(`Image too large: ${sizeInKB.toFixed(2)}KB`);
      throw new Error(`Image too large: ${sizeInKB.toFixed(2)}KB (max 500KB)`);
    }
    
    // Image is small enough, store as-is
    console.log(`Image size: ${sizeInKB.toFixed(2)}KB - storing in Firestore`);
    return imageData;
  } catch (err) {
    console.error('Error processing image:', err);
    throw err;
  }
};