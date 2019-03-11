// https://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module',
  },
  env: {
    browser: true,
  },
  extends: 'airbnb-base',
  // required to lint *.vue files
  plugins: ['html', 'vue'],
  // add your custom rules here
  rules: {
    'prefer-arrow-callback': 0,
    'arrow-body-style': 0,
    'comma-dangle': [
      'error',
      {
        arrays: 'only-multiline',
        objects: 'only-multiline',
        imports: 'only-multiline',
        exports: 'only-multiline',
        functions: 'only-multiline'
      }
    ],
    'func-names': 0,
    'no-alert': 0,
    'no-bitwise': 0,
    'no-console': 0,
    'no-lonely-if': 0,
    'no-multi-assign': 0,
    'no-plusplus': 0,
    'no-restricted-syntax': 0,
    'no-underscore-dangle': 0,
    'no-return-assign': ['error', 'except-parens'], // 禁止在 return 里赋值，除非被引号包裹。这是 eslint 的默认值。
    'object-shorthand': 0,
    'prefer-template': 0,
    'import/no-unresolved': 0,
    'import/newline-after-import': 0,
    'import/no-dynamic-require': 0,
    'import/extensions': ['off', 'never'],
    'import/no-extraneous-dependencies': ['error', {
      'devDependencies': true
    }],
    'global-require': 0,
    'no-unused-vars': 1,
    'no-mixed-operators': 0,
    'linebreak-style': 0,
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    // don't require .vue extension when importing
    'spaced-comment': 0,
    "prefer-destructuring": 0,
    "no-restricted-globals": 0,
    "function-paren-newline": 0
  }
}
