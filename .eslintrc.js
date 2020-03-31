module.exports = {
  env: {
    es6: true,
    node: true,
    mocha: true
  },
  extends: [
    'airbnb-base',
    'prettier',
    'plugin:chai-friendly/recommended',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  plugins: [
    'prettier',
    'chai-friendly'
  ],
  rules: {
    'import/named': 0,
    'prettier/prettier': 'error',
    'chai-friendly/no-unused-expressions': 2
  },
};
