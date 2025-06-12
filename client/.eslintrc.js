module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'react-app',
    'eslint:recommended',
    'plugin:react/recommended',
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    // ✅ Performance & developer-friendly settings
    'no-console': 'off',
    'no-unused-vars': 'warn',
    'react/prop-types': 'off',       // Turn off if you don’t use PropTypes
    'max-lines': 'off',              // Prevents large file warnings
    'complexity': 'off',             // Avoids false perf warnings
    'react/display-name': 'off',     // Avoids component name warnings
  },
};
