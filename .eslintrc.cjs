module.exports = {
  env: {
    browser: true,
    node: true,
    es2021: true,
  },

  parser: "@typescript-eslint/parser",

  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended"
  ],

  plugins: [
    "@typescript-eslint",
    "react",
    "react-hooks"
  ],

  settings: {
    react: {
      version: "detect"
    }
  },

  rules: {
    semi: ["warn", "always"],
    "react/react-in-jsx-scope": "off"
  }
};