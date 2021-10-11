module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
  },
  extends: ['airbnb', 'prettier'],
  plugins: ['prettier'],
  parserOptions: {
    ecmaVersion: 8,
  },
  rules: {
    'prettier/prettier': ['error'],
    'no-console': 'off',
  },
  settings: {
    react: {
      version: 'latest',
    },
  },
}
