// Directly require the theme from the theme package.
const theme = require('@directdrive/theme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  // Define the content paths specific to this application.
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    // Include the shared UI package
    '../../packages/ui/src/**/*.{js,ts,jsx,tsx}',
  ],
  // The entire theme configuration is now defined directly in this file.
  theme: {
    extend: {
      colors: theme.Colors,
      spacing: theme.Spacing,
      borderRadius: theme.Borders.radius,
      // This is the fix: We are now extracting the correct string values for boxShadow
      boxShadow: {
        subtle: theme.Shadows.subtle.boxShadow,
        button: theme.Shadows.button.boxShadow,
        none: theme.Shadows.none.boxShadow,
      },
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
