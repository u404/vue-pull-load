module.exports = {
  root: true,
  env: {
    node: true
  },
  "extends": [
    "plugin:vue/essential",
    "@vue/standard"
  ],
  rules: {
    "quotes": [
      "error",
      "double",
      {
        "avoidEscape": true,
        "allowTemplateLiterals": true
      }
    ],
    "semi": [
      "error",
      "never"
    ],
    "no-extra-semi": "off"
  },
  parserOptions: {
    parser: "babel-eslint"
  }
}
