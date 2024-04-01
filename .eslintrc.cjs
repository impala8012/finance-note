module.exports = {
  env: {
    browser: true,
    es2023: true
  },
  extends: [
    '@nuxtjs',
    'prettier/vue',
    'eslint:recommended',
    'plugin:nuxt/recommended',
    'plugin:prettier/recommended'
  ],
  parserOptions: {
    ecmaVersion: 2023,
    sourceType: 'module'
  },
  plugins: ['prettier'],
  rules: {
    'no-undef': 'off',
    'prettier/prettier': 'error'
  }
}
