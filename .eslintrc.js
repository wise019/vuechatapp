const vue = require('eslint-plugin-vue')
const prettier = require('eslint-plugin-prettier')

module.exports = [
  {
    files: ['src/**/*.{js,vue}'],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
    },
    plugins: {
      vue,
      prettier,
    },
    rules: {
      ...vue.configs.recommended.rules,
      ...prettier.configs.recommended.rules,
    },
  },
]
