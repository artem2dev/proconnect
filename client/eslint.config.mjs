import globals from 'globals';
import pluginJs from '@eslint/js';
import pluginReact from 'eslint-plugin-react';
import pluginImport from 'eslint-plugin-import';

/** @type {import('eslint').Linter.Config[]} */
export default [
  { files: ['**/*.{js,mjs,cjs,jsx}'] },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  pluginReact.configs.flat.recommended,
  pluginImport.configs.recommended, // Активируем правила плагина import
  {
    rules: {
      'react/prop-types': 'off',
      'import/no-unresolved': 'warn', // Проверка путей
      'import/extensions': ['error', 'ignorePackages', { js: 'never', jsx: 'never' }], // Убираем обязательное указание расширений
    },
  },
  {
    settings: {
      'import/resolver': {
        node: {
          paths: ['src'], // Абсолютные пути начинаются от src
          extensions: ['.js', '.jsx', '.mjs', '.cjs'], // Указываем поддерживаемые расширения
        },
      },
    },
  },
];
