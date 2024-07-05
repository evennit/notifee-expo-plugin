module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  plugins: ['@typescript-eslint/eslint-plugin'],
  parserOptions: {
    project: "tsconfig.json",
  },
  ignorePatterns: ['.eslintrc.js'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  rules: {},
};
