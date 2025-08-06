// Using module.exports to make the theme directly consumable by require() in tailwind.config.js
module.exports = {
  Colors: {
    background: {
      DEFAULT: '#F3F4F6', // gray-100
      light: '#FFFFFF',
    },
    primary: {
      DEFAULT: '#3B82F6', // blue-500
      light: '#93C5FD', // blue-300
      dark: '#2563EB',
    },
    secondary: {
      DEFAULT: '#FFFFFF',
      border: '#E5E7EB', // gray-200
      text: '#3B82F6', // blue-500
    },
    text: {
      primary: '#1F2937', // gray-800
      secondary: '#6B7280', // gray-500
      tertiary: '#9CA3AF', // gray-400
      white: '#FFFFFF',
    },
    border: {
      DEFAULT: '#E5E7EB', // gray-200
    },
    destructive: {
      DEFAULT: '#EF4444', // red-500 (Same as your 'danger' color)
      foreground: '#FFFFFF', // White text for good contrast
    },
    danger: {
      DEFAULT: '#EF4444', // red-500
      muted: '#FEE2E2',   // red-100
      border: '#FCA5A5', // red-300
      text: '#991B1B',   // red-900
    },
    success: {
      DEFAULT: '#22C55E', // green-500
      muted: '#DCFCE7',   // green-100
      border: '#86EFAC', // green-300
      text: '#15803D',   // green-700
    },
    warning: {
      DEFAULT: '#F59E0B', // amber-500
      muted: '#FEF3C7',   // yellow-100
      border: '#FDE047', // yellow-300
      text: '#B45309',   // amber-700
    },
    info: {
      DEFAULT: '#3B82F6', // blue-500
      muted: '#DBEAFE',   // blue-100
      border: '#BFDBFE', // blue-200
      text: '#1E40AF',   // blue-800
    },
    disabled: {
      background: '#D1D5DB', // gray-300
      text: '#9CA3AF', // gray-400
    },
    white: '#FFFFFF',
    card: '#FFFFFF',
    gray: {
      100: '#F3F4F6',
      200: '#E5E7EB',
      300: '#D1D5DB',
      400: '#9CA3AF',
      500: '#6B7280',
      800: '#1F2937',
    },
  },
  Spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
  },
  Borders: {
    radius: {
      md: 8,
      lg: 12,
      full: 9999,
    },
    width: {
      DEFAULT: 1,
    },
  },
  Shadows: {
    subtle: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
      boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
    },
    button: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
      boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
    },
    none: {
      shadowColor: 'transparent',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0,
      shadowRadius: 0,
      elevation: 0,
      boxShadow: 'none',
    },
  },
};
