import js from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default [
  { files: ['**/*.{js,mjs,cjs,ts,tsx}'] },
  { languageOptions: { globals: globals.browser } },
  { ignores: ['dist'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
]
