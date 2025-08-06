// packages/eslint-config-custom/index.js
module.exports = {
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier" // Ensures Prettier rules don't conflict with ESLint
  ],
  plugins: ["@typescript-eslint/eslint-plugin"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  env: {
    node: true,
    es6: true,
  },
  rules: {
    // Add any global ESLint rules here
    // e.g., "@typescript-eslint/no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }]
  },
  // Do not set 'root: true' in a shareable config.
  // Consuming packages should set 'root: true' in their own .eslintrc.js.
};
