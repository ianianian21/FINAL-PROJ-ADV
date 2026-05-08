/**
 * Image handling service
 * Handles profile picture storage without Firebase Storage
 * Uses free avatar generation + base64 storage
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
 */
export const processProfilePicture = async (base64Image: string): Promise<string> => {
  try {
    // Check base64 size in bytes
    // Base64 is ~33% larger than binary, so we estimate: base64.length * 0.75
    const estimatedBytes = base64Image.length * 0.75;
    const sizeInKB = estimatedBytes / 1024;
    
    // Allow up to 500KB
    if (estimatedBytes > 500000) {
      console.warn(`Image too large: ${sizeInKB.toFixed(2)}KB`);
      throw new Error(`Image too large: ${sizeInKB.toFixed(2)}KB (max 500KB)`);
    }
    
    // Image is small enough, store as-is
    console.log(`Image size: ${sizeInKB.toFixed(2)}KB - storing in Firestore`);
    return base64Image;
  } catch (err) {
    console.error('Error processing image:', err);
    throw err;
  }
};
