/**
 * Typography scale and font definitions
 * Uses Inter and Poppins fonts from expo-google-fonts
 */

export const TYPOGRAPHY = {
  // Font families
  fontFamily: {
    regular: 'Inter_400Regular',
    medium: 'Inter_500Medium',
    semibold: 'Inter_600SemiBold',
    bold: 'Inter_700Bold',
    heading: 'Poppins_600SemiBold',
    headingBold: 'Poppins_700Bold',
  },

  // Font sizes
  fontSize: {
    tiny: 12,
    small: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 28,
    '4xl': 32,
  },

  // Line heights
  lineHeight: {
    tight: 1.2,
    snug: 1.375,
    normal: 1.5,
    relaxed: 1.625,
    loose: 2,
  },

  // Letter spacing
  letterSpacing: {
    tight: -0.5,
    normal: 0,
    wide: 0.5,
  },
};

// Predefined text styles for consistency
export const TEXT_STYLES = {
  heading1: {
    fontSize: TYPOGRAPHY.fontSize['4xl'],           // 32
    fontFamily: TYPOGRAPHY.fontFamily.headingBold,
    lineHeight: TYPOGRAPHY.fontSize['4xl'] * 1.2,  // 38.4 ✅
    letterSpacing: TYPOGRAPHY.letterSpacing.tight,
  },
  heading2: {
    fontSize: TYPOGRAPHY.fontSize['3xl'],           // 28
    fontFamily: TYPOGRAPHY.fontFamily.heading,
    lineHeight: TYPOGRAPHY.fontSize['3xl'] * 1.375, // 38.5 ✅
    letterSpacing: TYPOGRAPHY.letterSpacing.normal,
  },
  heading3: {
    fontSize: TYPOGRAPHY.fontSize['2xl'],           // 24
    fontFamily: TYPOGRAPHY.fontFamily.semibold,
    lineHeight: TYPOGRAPHY.fontSize['2xl'] * 1.375, // 33 ✅
    letterSpacing: TYPOGRAPHY.letterSpacing.normal,
  },
  bodyLarge: {
    fontSize: TYPOGRAPHY.fontSize.lg,              // 18
    fontFamily: TYPOGRAPHY.fontFamily.regular,
    lineHeight: TYPOGRAPHY.fontSize.lg * 1.5,      // 27 ✅
  },
  body: {
    fontSize: TYPOGRAPHY.fontSize.base,            // 16
    fontFamily: TYPOGRAPHY.fontFamily.regular,
    lineHeight: TYPOGRAPHY.fontSize.base * 1.5,    // 24 ✅
  },
  bodySmall: {
    fontSize: TYPOGRAPHY.fontSize.small,           // 14
    fontFamily: TYPOGRAPHY.fontFamily.regular,
    lineHeight: TYPOGRAPHY.fontSize.small * 1.5,   // 21 ✅
  },
  labelLarge: {
    fontSize: TYPOGRAPHY.fontSize.base,            // 16
    fontFamily: TYPOGRAPHY.fontFamily.semibold,
    lineHeight: TYPOGRAPHY.fontSize.base * 1.5,    // 24 ✅
  },
  label: {
    fontSize: TYPOGRAPHY.fontSize.small,           // 14
    fontFamily: TYPOGRAPHY.fontFamily.medium,
    lineHeight: TYPOGRAPHY.fontSize.small * 1.375, // 19.25 ✅
  },
  labelSmall: {
    fontSize: TYPOGRAPHY.fontSize.tiny,            // 12
    fontFamily: TYPOGRAPHY.fontFamily.semibold,
    lineHeight: TYPOGRAPHY.fontSize.tiny * 1.375,  // 16.5 ✅
    letterSpacing: TYPOGRAPHY.letterSpacing.wide,
  },
  caption: {
    fontSize: TYPOGRAPHY.fontSize.tiny,            // 12
    fontFamily: TYPOGRAPHY.fontFamily.regular,
    lineHeight: TYPOGRAPHY.fontSize.tiny * 1.375,  // 16.5 ✅
  },
  button: {
    fontSize: TYPOGRAPHY.fontSize.base,            // 16
    fontFamily: TYPOGRAPHY.fontFamily.semibold,
    lineHeight: TYPOGRAPHY.fontSize.base * 1.375,  // 22 ✅
  },
};