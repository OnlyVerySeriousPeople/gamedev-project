import js from '@eslint/js';
import airbnbBase from 'eslint-config-airbnb-base';
import prettierConfig from 'eslint-config-prettier';
import importPlugin from 'eslint-plugin-import';
import globals from 'globals';

export default [
  {
    files: ['src/**/*.js', '*.config.js'],
    ...js.configs.recommended,
    ...prettierConfig,
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
      },
    },
    plugins: {
      import: importPlugin,
    },
    rules: {
      ...airbnbBase.rules,
      'import/extensions': ['error', 'ignorePackages'],
      'import/order': [
        'warn',
        {
          'newlines-between': 'always',
          alphabetize: {
            order: 'asc',
          },
        },
      ],
      'no-alert': 'off',
      'no-console': 'off',
    },
  },
];
