module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    es2021: true,
  },
  parser: 'vue-eslint-parser',
  parserOptions: {
    sourceType: 'module',
    "ecmaVersion": 2021
  },
  extends: [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/typescript/recommended'
  ],
  rules: {
    'semicolon': 'off',
    // '@typescript-eslint/indent': ['error', 2],
    // '@typescript-eslint/member-delimiter-style': 'off',
    // '@typescript-eslint/camelcase': 'off',
    // '@typescript-eslint/no-unused-vars': 'off',
    'import/no-named-as-default': 'off',
    'vue/order-in-components': 'off',
    'vue/no-deprecated-slot-attribute': 'off',
    'no-console': 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'comma-dangle': 'off',
    'no-unused-vars': 'off',
    'prefer-const': 'off',
    'require-await': 'off',
    'no-constant-condition': 'off',
    'no-self-compare': 'off',
    'vue/max-attributes-per-line': 'off',
    'vue/no-unused-components': 'off',
    'vue/html-self-closing': 'off',
    'vue/no-unused-vars': 'off',
    'vue/singleline-html-element-content-newline': 'off',
    'vue/multiline-html-element-content-newline': 'off',
    'space-before-function-paren': 'off',
    'no-prototype-builtins': 'off',
    'no-case-declarations': 'off',
    'camelcase': 'off'
  }
};
