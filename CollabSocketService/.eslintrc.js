module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
    mocha: true,
  },
  extends: ['airbnb', 'prettier'],
  plugins: ['prettier'],
  parserOptions: {
    ecmaVersion: 2020,
  },
  rules: {
    'prettier/prettier': ['error'],
    'no-console': 'off',
    'no-else-return': 'off',
  },
  settings: {
    react: {
      version: 'latest',
    },
  },
}
