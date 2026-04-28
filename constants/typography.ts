/**
 * KanjiVibe Typography System
 * Space Grotesk for headlines, Manrope for body/labels
 */

import { TextStyle } from 'react-native';

export const FontFamily = {
  headline: 'SpaceGrotesk_700Bold',
  headlineMedium: 'SpaceGrotesk_500Medium',
  headlineLight: 'SpaceGrotesk_300Light',
  body: 'Manrope_400Regular',
  bodyMedium: 'Manrope_500Medium',
  bodySemiBold: 'Manrope_600SemiBold',
  bodyBold: 'Manrope_700Bold',
  label: 'Manrope_500Medium',
  labelBold: 'Manrope_700Bold',
} as const;

/** Typography scale matching the design system */
export const Typography: Record<string, TextStyle> = {
  // Display — Large Kanji characters
  displayLg: {
    fontFamily: FontFamily.headlineLight,
    fontSize: 96,
    lineHeight: 96,
    letterSpacing: -2,
  },
  displayMd: {
    fontFamily: FontFamily.headlineLight,
    fontSize: 64,
    lineHeight: 72,
    letterSpacing: -1,
  },
  displaySm: {
    fontFamily: FontFamily.headline,
    fontSize: 48,
    lineHeight: 52,
    letterSpacing: -0.5,
  },

  // Headlines — Section titles
  headlineLg: {
    fontFamily: FontFamily.headline,
    fontSize: 32,
    lineHeight: 40,
    letterSpacing: -0.5,
  },
  headlineMd: {
    fontFamily: FontFamily.headline,
    fontSize: 28,
    lineHeight: 36,
    letterSpacing: -0.3,
  },
  headlineSm: {
    fontFamily: FontFamily.headline,
    fontSize: 24,
    lineHeight: 32,
    letterSpacing: -0.2,
  },

  // Titles
  titleLg: {
    fontFamily: FontFamily.headline,
    fontSize: 22,
    lineHeight: 28,
  },
  titleMd: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: 0.15,
  },
  titleSm: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0.1,
  },

  // Body
  bodyLg: {
    fontFamily: FontFamily.body,
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: 0.15,
  },
  bodyMd: {
    fontFamily: FontFamily.body,
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0.25,
  },
  bodySm: {
    fontFamily: FontFamily.body,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.4,
  },

  // Labels — Tags, badges, small UI text
  labelLg: {
    fontFamily: FontFamily.labelBold,
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0.1,
  },
  labelMd: {
    fontFamily: FontFamily.labelBold,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.5,
  },
  labelSm: {
    fontFamily: FontFamily.labelBold,
    fontSize: 10,
    lineHeight: 14,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },

  // Kanji-specific
  kanjiDisplay: {
    fontFamily: FontFamily.headlineLight,
    fontSize: 128,
    lineHeight: 128,
  },
  kanjiFocus: {
    fontFamily: FontFamily.headline,
    fontSize: 64,
    lineHeight: 64,
  },
  romaji: {
    fontFamily: FontFamily.label,
    fontSize: 18,
    lineHeight: 24,
    letterSpacing: 6,
    textTransform: 'uppercase',
  },
} as const;
