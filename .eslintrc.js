module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: ['plugin:vue/essential', '@vue/prettier', '@vue/typescript'],
  parserOptions: {
    parser: '@typescript-eslint/parser'
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-unused-vars': [
      2,
      {
        vars: 'all', // 变量定义必须被使用
        args: 'none', // 对于函数形参不检测
        ignoreRestSiblings: true, // 忽略剩余子项 fn(...args)，{a, b, ...coords}
        caughtErrors: 'none' // 忽略 catch 语句的参数使用
      }
    ]
  },
  overrides: [
    {
      files: ['**/__tests__/*.{j,t}s?(x)', '**/tests/unit/**/*.spec.{j,t}s?(x)'],
      env: {
        jest: true
      }
    }
  ]
}
