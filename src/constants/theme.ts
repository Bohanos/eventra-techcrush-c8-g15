export const colors = {
  primary: '#6C47FF',
  primaryDark: '#5636CC',
  primaryLight: '#EDE9FE',

  background: '#F8F7FC',
  surface: '#FFFFFF',

  text: '#15152B',
  textMuted: '#6B7280',
  textFaint: '#9CA3AF',

  border: '#E5E7EB',

  success: '#16A34A',
  warning: '#D97706',
  warningBg: '#FEF3C7',
  error: '#DC2626',

  white: '#FFFFFF',
  black: '#000000',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  pill: 999,
};

export const typography = {
  h1: { fontSize: 28, fontWeight: '700' as const },
  h2: { fontSize: 22, fontWeight: '700' as const },
  h3: { fontSize: 18, fontWeight: '600' as const },
  body: { fontSize: 15, fontWeight: '400' as const },
  bodyBold: { fontSize: 15, fontWeight: '600' as const },
  caption: { fontSize: 13, fontWeight: '400' as const },
  small: { fontSize: 11, fontWeight: '400' as const },
};

const theme = { colors, spacing, radius, typography };

export default theme;