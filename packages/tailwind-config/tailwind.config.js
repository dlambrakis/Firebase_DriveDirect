// Import the compiled and packaged theme
const theme = require('@directdrive/theme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  // This is a base config, no "content" array needed here.
  theme: {
    extend: {
      // Use the theme values from the imported package
      colors: theme.Colors,
      spacing: theme.Spacing,
      borderRadius: theme.Borders.radius,
      boxShadow: theme.Shadows,
      fontFamily: {
        sans: ['Inter', 'system-ui', 'Avenir', 'Helvetica', 'Arial', 'sans-serif'],
      },
      fontSize: {
        'heading-1': ['2.5rem', { lineHeight: '3rem', fontWeight: '700' }],
        'heading-2': ['2rem', { lineHeight: '2.5rem', fontWeight: '700' }],
        'heading-3': ['1.5rem', { lineHeight: '2rem', fontWeight: '700' }],
        'body-lg': ['1.125rem', { lineHeight: '1.75rem', fontWeight: '400' }],
        'body-md': ['1rem', { lineHeight: '1.5rem', fontWeight: '400' }],
        'body-sm': ['0.875rem', { lineHeight: '1.25rem', fontWeight: '400' }],
        'label': ['0.75rem', { lineHeight: '1rem', fontWeight: '500' }],
      },
      keyframes: {
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-in-up': 'fade-in-up 0.5s ease-out forwards',
      },
    },
  },
  plugins: [],
};
