module.exports = {
  "parser": "@typescript-eslint/parser",
  "extends": [
    "eslint-config-blvd"
  ],
  "parserOptions": {
    "ecmaVersion": 2020,
    "project": "./tsconfig.json",
    "tsconfigRootDir": __dirname,
  },
  "ignorePatterns": "local/**",
  "rules": {
    "max-len": "off",
    "indent": "off",
    "semi": [
      "warn",
      "never"
    ],
    "comma-dangle": [
      "warn",
      "always-multiline"
    ],
    "import/prefer-default-export": "off",
    "comma-spacing": "off",
    "@typescript-eslint/comma-spacing": "error",
    "@typescript-eslint/no-use-before-define": "off",
    "@typescript-eslint/member-delimiter-style": [
      "warn",
      {
        "multiline": {
          "delimiter": "comma",
          "requireLast": true
        },
        "singleline": {
          "delimiter": "comma",
          "requireLast": false
        }
      }
    ],
    "@typescript-eslint/no-floating-promises": "error",
    "no-restricted-imports": [
      "error",
      {
        "paths": [
          {
            "name": "process",
            "importNames": [
              "env"
            ],
            "message": "Use src/env/env.ts instead"
          }
        ]
      }
    ],
  }
}
