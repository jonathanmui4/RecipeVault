module.exports = {
  root: true,
  env: {
    node: true,
    browser: true,
    es2021: true,
  },
  extends: [
    'plugin:vue/vue3-recommended', // Use stricter "recommended" for better Vue.js practices
    'eslint:recommended',
    '@vue/typescript/recommended',
    'plugin:prettier/recommended',
  ],
  parserOptions: {
    parser: '@typescript-eslint/parser',
    ecmaVersion: 2022, // Updated to more recent ECMAScript version
    sourceType: 'module',
  },
  rules: {
    // Allow console logs in development but warn in production
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',

    // Vue specific rules
    'vue/component-name-in-template-casing': ['error', 'PascalCase'],
    'vue/multi-word-component-names': [
      'warn',
      {
        ignores: ['Home', 'Login', 'Dashboard', 'Settings', 'Profile'],
      },
    ],
    'vue/no-v-html': 'warn', // Warn on potential XSS instead of error
    'vue/require-default-prop': 'off', // Optional props can be undefined
    'vue/attributes-order': 'warn', // Encourage consistent attribute order
    'vue/require-explicit-emits': 'warn', // Warn instead of error for emit declarations

    // TypeScript rules
    '@typescript-eslint/explicit-module-boundary-types': 'off', // Not needed with type inference
    '@typescript-eslint/no-explicit-any': 'warn', // Warn on any type but don't error
    '@typescript-eslint/no-non-null-assertion': 'warn', // Prefer optional chaining
    '@typescript-eslint/no-unused-vars': [
      'warn',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
      },
    ],

    // Best practices
    eqeqeq: ['error', 'always'], // Require === and !==
    'no-var': 'error', // Prevent usage of var
    'prefer-const': 'warn', // Use const when not reassigning
    curly: ['warn', 'all'], // Require curly braces for control statements
  },
  globals: {
    defineProps: 'readonly',
    defineEmits: 'readonly',
    defineExpose: 'readonly',
    withDefaults: 'readonly',
  },
  overrides: [
    {
      files: [
        '**/__tests__/*.{j,t}s?(x)',
        '**/tests/unit/**/*.spec.{j,t}s?(x)',
      ],
      env: {
        jest: true,
      },
      rules: {
        // Relax rules for tests
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-non-null-assertion': 'off',
      },
    },
  ],
};
