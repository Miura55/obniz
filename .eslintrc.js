const path = require('path');

let tsRules = {
  'prettier/prettier': [
    'error',
    {
      singleQuote: true,
      trailingComma: 'es5',
    },
  ],
  'no-console': 'off',
  'no-inner-declarations': 'warn',
  'no-constant-condition': [
    'error',
    {
      checkLoops: false,
    },
  ],

  'no-unused-vars': 'off',
  '@typescript-eslint/no-unused-vars': [
    'warn',
    {
      args: 'none',
    },
  ],
  'no-var': 'error',
  'non-ascii': [
    'error',
    {
      allowedChars: '°',
    },
  ],
  'async-function-name': ['error'],
  '@typescript-eslint/adjacent-overload-signatures': 'error',
  '@typescript-eslint/array-type': [
    'error',
    {
      default: 'array',
    },
  ],
  '@typescript-eslint/ban-types': [
    'error',
    {
      types: {
        Object: {
          message: 'Avoid using the `Object` type. Did you mean `object`?',
        },
        Function: {
          message:
            'Avoid using the `Function` type. Prefer a specific function type, like `() => void`.',
        },
        Boolean: {
          message: 'Avoid using the `Boolean` type. Did you mean `boolean`?',
        },
        Number: {
          message: 'Avoid using the `Number` type. Did you mean `number`?',
        },
        String: {
          message: 'Avoid using the `String` type. Did you mean `string`?',
        },
        Symbol: {
          message: 'Avoid using the `Symbol` type. Did you mean `symbol`?',
        },
      },
    },
  ],
  '@typescript-eslint/consistent-type-assertions': 'error',
  '@typescript-eslint/dot-notation': 'error',
  '@typescript-eslint/indent': 'off',
  '@typescript-eslint/ban-ts-comment': 'warn',
  '@typescript-eslint/naming-convention': 'off',
  '@typescript-eslint/no-empty-function': 'off',
  '@typescript-eslint/no-empty-interface': 'off',
  '@typescript-eslint/no-explicit-any': 'off',
  '@typescript-eslint/no-misused-new': 'off',
  '@typescript-eslint/no-namespace': 'off',
  '@typescript-eslint/no-parameter-properties': 'off',
  '@typescript-eslint/no-shadow': [
    'error',
    {
      hoist: 'all',
    },
  ],
  '@typescript-eslint/no-unused-expressions': 'error',
  '@typescript-eslint/no-use-before-define': 'off',
  '@typescript-eslint/no-var-requires': 'off',
  '@typescript-eslint/no-unsafe-call': 'warn',
  '@typescript-eslint/no-unsafe-member-access': 'warn',
  '@typescript-eslint/no-unsafe-assignment': 'warn',
  '@typescript-eslint/restrict-plus-operands': 'warn',
  '@typescript-eslint/no-unsafe-return': 'warn',

  '@typescript-eslint/prefer-for-of': 'off',
  '@typescript-eslint/prefer-function-type': 'error',
  '@typescript-eslint/prefer-namespace-keyword': 'error',
  '@typescript-eslint/triple-slash-reference': [
    'error',
    {
      path: 'always',
      types: 'prefer-import',
      lib: 'always',
    },
  ],
  '@typescript-eslint/unified-signatures': 'error',
  'accessor-pairs': 'off',
  'array-bracket-newline': 'off',
  'array-bracket-spacing': 'off',
  'array-callback-return': 'off',
  'array-element-newline': 'off',
  'arrow-body-style': 'off',
  'arrow-parens': 'off',
  'arrow-spacing': 'off',
  'block-scoped-var': 'off',
  'block-spacing': 'off',
  'brace-style': 'off',
  'callback-return': 'off',
  camelcase: 'off',
  'capitalized-comments': 'off',
  'class-methods-use-this': 'off',
  'comma-dangle': 'off',
  'comma-spacing': 'off',
  'comma-style': 'off',
  complexity: 'off',
  'computed-property-spacing': 'off',
  'consistent-return': 'off',
  'consistent-this': 'off',
  'constructor-super': 'error',
  curly: 'off',
  'default-case': 'off',
  'dot-location': 'off',
  'dot-notation': 'off',
  'eol-last': 'off',
  eqeqeq: ['error', 'smart'],
  'for-direction': 'error',
  'func-call-spacing': 'off',
  'func-name-matching': 'off',
  'func-names': 'off',
  'func-style': 'off',
  'function-paren-newline': 'off',
  'generator-star': 'off',
  'generator-star-spacing': 'off',
  'getter-return': 'error',
  'global-require': 'off',
  'guard-for-in': 'off',
  'handle-callback-err': 'off',
  'id-blacklist': 'off',
  'id-length': 'off',
  'id-match': 'off',
  'implicit-arrow-linebreak': 'off',
  indent: 'off',
  'indent-legacy': 'off',
  'init-declarations': 'off',
  'jsdoc/check-alignment': 'error',
  'jsdoc/check-indentation': 'error',
  'jsdoc/newline-after-description': 'error',
  'jsx-quotes': 'off',
  'key-spacing': 'off',
  'keyword-spacing': 'off',
  'line-comment-position': 'off',
  'linebreak-style': 'off',
  'lines-around-comment': 'off',
  'lines-around-directive': 'off',
  'lines-between-class-members': 'off',
  'max-classes-per-file': ['error', 1],
  'max-depth': 'off',
  'max-lines': 'off',
  'max-lines-per-function': 'off',
  'max-nested-callbacks': 'off',
  'max-params': 'off',
  'max-statements': 'off',
  'max-statements-per-line': 'off',
  'multiline-comment-style': 'off',
  'multiline-ternary': 'off',
  'new-cap': 'off',
  'new-parens': 'error',
  'newline-after-var': 'off',
  'newline-before-return': 'off',
  'newline-per-chained-call': 'off',
  'no-alert': 'off',
  'no-array-constructor': 'off',
  'no-arrow-condition': 'off',
  'no-async-promise-executor': 'off',
  'no-await-in-loop': 'off',
  'no-bitwise': 'off',
  'no-buffer-constructor': 'off',
  'no-caller': 'error',
  'no-case-declarations': 'error',
  'no-catch-shadow': 'off',
  'no-class-assign': 'error',
  'no-comma-dangle': 'off',
  'no-compare-neg-zero': 'error',
  'no-cond-assign': 'error',
  'no-confusing-arrow': 'off',
  'no-const-assign': 'error',
  'no-continue': 'off',
  'no-control-regex': 'error',
  'no-debugger': 'error',
  'no-delete-var': 'error',
  'no-div-regex': 'off',
  'no-dupe-args': 'error',
  'no-dupe-class-members': 'error',
  'no-dupe-keys': 'error',
  'no-duplicate-case': 'error',
  'no-duplicate-imports': 'off',
  'no-else-return': 'off',
  'no-empty': 'off',
  'no-empty-character-class': 'error',
  'no-empty-function': 'off',
  'no-empty-pattern': 'error',
  'no-eq-null': 'off',
  'no-eval': 'error',
  'no-ex-assign': 'error',
  'no-extend-native': 'off',
  'no-extra-bind': 'off',
  'no-extra-boolean-cast': 'error',
  'no-extra-label': 'off',
  'no-extra-parens': 'off',
  'no-extra-semi': 'off',
  'no-fallthrough': 'off',
  'no-floating-decimal': 'off',
  'no-func-assign': 'error',
  'no-global-assign': 'error',
  'no-implicit-coercion': 'off',
  'no-implicit-globals': 'off',
  'no-implied-eval': 'off',
  'no-inline-comments': 'off',
  'no-invalid-regexp': 'error',
  'no-invalid-this': 'off',
  'no-irregular-whitespace': 'error',
  'no-iterator': 'off',
  'no-label-var': 'off',
  'no-labels': 'off',
  'no-lone-blocks': 'off',
  'no-lonely-if': 'off',
  'no-loop-func': 'off',
  'no-magic-numbers': 'off',
  'no-misleading-character-class': 'off',
  'no-mixed-operators': 'off',
  'no-mixed-requires': 'off',
  'no-mixed-spaces-and-tabs': 'off',
  'no-multi-assign': 'off',
  'no-multi-spaces': 'off',
  'no-multi-str': 'off',
  'no-multiple-empty-lines': 'off',
  'no-native-reassign': 'off',
  'no-negated-condition': 'off',
  'no-negated-in-lhs': 'off',
  'no-nested-ternary': 'off',
  'no-new': 'off',
  'no-new-func': 'off',
  'no-new-object': 'off',
  'no-new-require': 'off',
  'no-new-symbol': 'error',
  'no-new-wrappers': 'error',
  'no-obj-calls': 'error',
  'no-octal': 'error',
  'no-octal-escape': 'off',
  'no-param-reassign': 'off',
  'no-path-concat': 'off',
  'no-plusplus': 'off',
  'no-process-env': 'off',
  'no-process-exit': 'off',
  'no-proto': 'off',
  'no-prototype-builtins': 'off',
  'no-redeclare': 'error',
  'no-regex-spaces': 'error',
  'no-reserved-keys': 'off',
  'no-restricted-globals': 'off',
  'no-restricted-imports': 'off',
  'no-restricted-modules': 'off',
  'no-restricted-properties': 'off',
  'no-restricted-syntax': 'off',
  'no-return-assign': 'off',
  'no-return-await': 'off',
  'no-script-url': 'off',
  'no-self-assign': 'error',
  'no-self-compare': 'off',
  'no-sequences': 'off',
  'no-shadow': 'off',
  'no-shadow-restricted-names': 'off',
  'no-space-before-semi': 'off',
  'no-spaced-func': 'off',
  'no-sparse-arrays': 'error',
  'no-sync': 'off',
  'no-tabs': 'off',
  'no-template-curly-in-string': 'off',
  'no-ternary': 'off',
  'no-this-before-super': 'error',
  'no-throw-literal': 'error',
  'no-trailing-spaces': 'error',
  'no-undef': 'error',
  'no-undef-init': 'error',
  'no-undefined': 'off',
  'no-underscore-dangle': 'off',
  'no-unexpected-multiline': 'off',
  'no-unmodified-loop-condition': 'off',
  'no-unneeded-ternary': 'off',
  'no-unreachable': 'error',
  'no-unsafe-finally': 'error',
  'no-unsafe-negation': 'error',
  'no-unused-expressions': 'off',
  'no-unused-labels': 'error',
  'no-use-before-define': 'off',
  'no-useless-call': 'off',
  'no-useless-catch': 'off',
  'no-useless-computed-key': 'off',
  'no-useless-concat': 'off',
  'no-useless-constructor': 'off',
  'no-useless-escape': 'error',
  'no-useless-rename': 'off',
  'no-useless-return': 'off',
  'no-void': 'off',
  'no-warning-comments': 'off',
  'no-whitespace-before-property': 'off',
  'no-with': 'off',
  'no-wrap-func': 'off',
  'nonblock-statement-body-position': 'off',
  'object-curly-newline': 'off',
  'object-curly-spacing': 'off',
  'object-property-newline': 'off',
  'object-shorthand': 'error',
  'one-var': ['error', 'never'],
  'one-var-declaration-per-line': 'off',
  'operator-assignment': 'off',
  'operator-linebreak': 'off',
  'padded-blocks': 'off',
  'padding-line-between-statements': 'off',
  'prefer-arrow-callback': 'off',
  'prefer-arrow/prefer-arrow-functions': 'error',
  'prefer-const': 'error',
  'prefer-destructuring': 'off',
  'prefer-named-capture-group': 'off',
  'prefer-numeric-literals': 'off',
  'prefer-object-spread': 'off',
  'prefer-promise-reject-errors': 'off',
  'prefer-reflect': 'off',
  'prefer-rest-params': 'off',
  'prefer-spread': 'off',
  'prefer-template': 'off',
  'quote-props': 'off',
  quotes: 'off',
  radix: 'off',
  'require-atomic-updates': 'off',
  'require-await': 'off',
  'require-jsdoc': 'off',
  'require-unicode-regexp': 'off',
  'require-yield': 'error',
  'rest-spread-spacing': 'off',
  semi: 'off',
  'semi-spacing': 'off',
  'semi-style': 'off',
  'sort-imports': 'off',
  'sort-keys': 'off',
  'sort-vars': 'off',
  'space-after-function-name': 'off',
  'space-after-keywords': 'off',
  'space-before-blocks': 'off',
  'space-before-function-paren': 'off',
  'space-before-function-parentheses': 'off',
  'space-before-keywords': 'off',
  'space-in-brackets': 'off',
  'space-in-parens': 'off',
  'space-infix-ops': 'off',
  'space-return-throw-case': 'off',
  'space-unary-ops': 'off',
  'space-unary-word-ops': 'off',
  'spaced-comment': [
    'error',
    'always',
    {
      markers: ['/'],
    },
  ],
  strict: 'off',
  'switch-colon-spacing': 'off',
  'symbol-description': 'off',
  'template-curly-spacing': 'off',
  'template-tag-spacing': 'off',
  'unicode-bom': 'off',
  'use-isnan': 'error',
  'valid-jsdoc': 'off',
  'valid-typeof': 'off',
  'vars-on-top': 'off',
  'wrap-iife': 'off',
  'wrap-regex': 'off',
  'yield-star-spacing': 'off',
  yoda: 'off',
  // '@typescript-eslint/tslint/config': [
  //   'error',
  //   {
  //     rules: {
  //       prettier: [
  //         true,
  //         {
  //           trailingComma: 'all',
  //           arrowParens: 'always',
  //           quoteProps: 'consistent',
  //           printWidth: 120,
  //         },
  //       ],
  //     },
  //   },
  // ],
};
module.exports = {
  root: true,
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  parserOptions: {
    ecmaVersion: 2017,
  },
  extends: ['eslint:recommended', 'plugin:prettier/recommended'],
  plugins: ['eslint-plugin-jsdoc', 'eslint-plugin-prefer-arrow'],
  rules: {
    'prettier/prettier': [
      'error',
      {
        singleQuote: true,
        trailingComma: 'es5',
      },
    ],
    'no-console': 'off',
    'no-inner-declarations': 'warn',
    'no-constant-condition': [
      'error',
      {
        checkLoops: false,
      },
    ],
    'no-unused-vars': [
      'error',
      {
        args: 'none',
      },
    ],
    'no-var': 'error',
    'non-ascii': [
      'error',
      {
        allowedChars: '°',
      },
    ],
    'async-function-name': ['error'],
  },
  overrides: [
    {
      files: ['**/*.ts'],

      env: {
        browser: true,
        es6: true,
        node: true,
      },
      extends: [
        'eslint:recommended',
        'plugin:prettier/recommended',
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended',
      ],
      parser: '@typescript-eslint/parser',

      parserOptions: {
        ecmaVersion: 2017,
        project: path.join(__dirname, 'tsconfig.eslint.json'),
        sourceType: 'module',
      },
      plugins: [
        'eslint-plugin-jsdoc',
        'eslint-plugin-prefer-arrow',
        '@typescript-eslint',
      ],
      rules: tsRules,
    },
  ],
};
