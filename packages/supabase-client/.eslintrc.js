// packages/supabase-client/.eslintrc.js
module.exports = {
  root: true,
  env: {
    node: true,
    es6: true,
  },
  extends: [
    'custom', // Extends from eslint-config-custom
    'plugin:@typescript-eslint/recommended', // Ensure TS rules are fully applied
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json'],
    tsconfigRootDir: __dirname,
  },
  plugins: ['@typescript-eslint'], // Ensure plugin is listed if not covered by custom fully for this context
  rules: {
    // Add any supabase-client specific rules here
  },
  ignorePatterns: ["dist/", "node_modules/"],
};
