import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import vitestPlugin from '@vitest/eslint-plugin';
import eslintConfigPrettier from 'eslint-config-prettier';

export default tseslint.config(
  {
    ignores: ['lib/**', 'node_modules/**']
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['src/**/*.{ts,tsx}', 'tests/**/*.{ts,tsx}'],
    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooksPlugin
    },
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true
        }
      }
    },
    settings: {
      react: {
        version: 'detect'
      }
    },
    rules: {
      ...reactPlugin.configs.recommended.rules,

      '@typescript-eslint/no-use-before-define': 'off',
      'react/prop-types': 'off'
    }
  },
  {
    files: ['tests/**/*.{ts,tsx}'],
    plugins: {
      vitest: vitestPlugin
    }
  },
  eslintConfigPrettier
);
