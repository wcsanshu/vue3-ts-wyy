module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    "plugin:vue/vue3-essential",
    "@vue/standard",
    "@vue/typescript/recommended"
  ],
  parserOptions: {
    ecmaVersion: 2020
  },
  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
    quotes: "off", // 关闭单引号
    "space-before-function-paren": "off", // 函数括号后面不需要检测空格
    "no-unused-vars": "warn", // 没有到的值或函数 警告即可
    "vue/multi-word-component-names": "off",
    "vue/no-unused-vars": "warn",
    "no-undef": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-non-null-assertion": "off",
    indent: "off"
  }
}
