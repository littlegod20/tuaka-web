import js from '@eslint/js'
import ts from 'typescript-eslint'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import prettier from 'eslint-config-prettier'

export default ts.config(
  // files to lint
  { files: ['**/*.{ts,tsx}'] },

  // files and folders to completely ignore
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/.turbo/**',
      '**/build/**',
    ],
  },

  // base JS rules
  js.configs.recommended,

  // TypeScript rules
  ...ts.configs.recommended,

  // React rules
  {
    plugins: {
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    settings: {
      react: { version: 'detect' },
    },
    rules: {
      // ─── React ───────────────────────────────────
      'react/react-in-jsx-scope': 'off',       // not needed in React 18
      'react/prop-types': 'off',               // we use TypeScript for this
      'react/self-closing-comp': 'warn',       // <Component /> not <Component></Component>
      'react/jsx-sort-props': ['warn', {       // alphabetical prop order
        callbacksLast: true,
        shorthandFirst: true,
      }],

      // ─── React Hooks ─────────────────────────────
      'react-hooks/rules-of-hooks': 'error',   // no hooks in loops or conditions
      'react-hooks/exhaustive-deps': 'warn',   // missing useEffect dependencies

      // ─── React Refresh (Vite HMR) ────────────────
      'react-refresh/only-export-components': 'warn',

      // ─── TypeScript ──────────────────────────────
      '@typescript-eslint/no-unused-vars': ['warn', {
        argsIgnorePattern: '^_',               // allow _unused prefix
        varsIgnorePattern: '^_',
      }],
      '@typescript-eslint/no-explicit-any': 'warn',     // avoid any
      '@typescript-eslint/consistent-type-imports': [   // import type {}
        'warn',
        { prefer: 'type-imports' },
      ],

      // ─── General ─────────────────────────────────
      'no-console': ['warn', {
        allow: ['warn', 'error'],              // console.log not allowed
      }],
      'prefer-const': 'error',                 // no let when const works
      'no-duplicate-imports': 'error',         // one import per module
    },
  },

  // turn off ESLint rules that Prettier handles
  prettier,
)
