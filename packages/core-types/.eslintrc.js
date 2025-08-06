// packages/core-types/.eslintrc.js
module.exports = {
  root: true,
  env: {
    node: true,
    es6: true,
  },
  extends: [
    'custom', // Extends from eslint-config-custom
    'plugin:@typescript-eslint/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json'],
    tsconfigRootDir: __dirname,
  },
  plugins: ['@typescript-eslint'],
  rules: {
    // Add any core-types specific rules here
  },
  ignorePatterns: ["dist/", "node_modules/"],
};
