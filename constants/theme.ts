/**
 * KanjiVibe — Liquid Glass Darknight Design Tokens
 * Extracted from the DESIGN.md specification
 */

export const Colors = {
  // Surface hierarchy (The Void → Glass Stack)
  surface: '#0d1321',
  surfaceDim: '#0d1321',
  surfaceContainerLowest: '#080e1c',
  surfaceContainerLow: '#161b2a',
  surfaceContainer: '#1a1f2e',
  surfaceContainerHigh: '#242a39',
  surfaceContainerHighest: '#2f3444',
  surfaceBright: '#333949',
  surfaceVariant: '#2f3444',

  // Primary — Electric Purple (The Energy Source)
  primary: '#d2bbff',
  primaryContainer: '#7c3aed',
  primaryFixed: '#eaddff',
  primaryFixedDim: '#d2bbff',
  onPrimary: '#3f008e',
  onPrimaryContainer: '#ede0ff',
  onPrimaryFixed: '#25005a',
  onPrimaryFixedVariant: '#5a00c6',
  inversePrimary: '#732ee4',
  surfaceTint: '#d2bbff',

  // Secondary — Cyan (The Precision Tool)
  secondary: '#d3fbff',
  secondaryContainer: '#00eefc',
  secondaryFixed: '#7df4ff',
  secondaryFixedDim: '#00dbe9',
  onSecondary: '#00363a',
  onSecondaryContainer: '#00686f',
  onSecondaryFixed: '#002022',
  onSecondaryFixedVariant: '#004f54',

  // Tertiary — Magenta/Violet (The Accent Highlight)
  tertiary: '#ecb2ff',
  tertiaryContainer: '#a600e0',
  tertiaryFixed: '#f8d8ff',
  tertiaryFixedDim: '#ecb2ff',
  onTertiary: '#520071',
  onTertiaryContainer: '#faddff',
  onTertiaryFixed: '#320047',
  onTertiaryFixedVariant: '#74009f',

  // Neutral text
  onBackground: '#dde2f6',
  onSurface: '#dde2f6',
  onSurfaceVariant: '#ccc3d8',
  inverseSurface: '#dde2f6',
  inverseOnSurface: '#2b3040',
  background: '#0d1321',

  // Error
  error: '#ffb4ab',
  errorContainer: '#93000a',
  onError: '#690005',
  onErrorContainer: '#ffdad6',

  // Outline
  outline: '#958da1',
  outlineVariant: '#4a4455',
} as const;

/** Solid card styles */
export const Glass = {
  background: Colors.surfaceContainerLow,
  backgroundStrong: Colors.surfaceContainerHigh,
  backgroundGradientStart: Colors.surfaceContainerLow,
  backgroundGradientEnd: Colors.surfaceContainerLow,
  border: 'rgba(255, 255, 255, 0.08)',
  borderSubtle: 'rgba(255, 255, 255, 0.05)',
  borderGhost: 'rgba(255, 255, 255, 0.03)',
  blurIntensity: 0,
} as const;

/** Spacing scale (in dp) */
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  '2xl': 32,
  '3xl': 48,
  '4xl': 64,
} as const;

/** Border radius scale */
export const Radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  '2xl': 32,
  '3xl': 40,
  full: 9999,
} as const;

/** Minimal shadows */
export const Shadows = {
  purpleGlow: {},
  cyanGlow: {},
  magentaGlow: {},
  buttonGlow: {},
  tabBarGlow: {},
} as const;

export type ColorKey = keyof typeof Colors;
