// 验证不为空
const notEmpty = (rule, value, callback) => {
  if (value === '' || value === null || value === undefined) {
    callback(new Error('不允许为空'))
  } else {
    callback()
  }
}

// 邮箱验证
const email = (rule, value, callback) => {
  const myReg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  if (value === '' || value === null || value === undefined) {
    callback(new Error('不允许为空'))
  } else if (!myReg.test(value)) {
    callback(new Error('请输入正确的邮箱格式'))
  } else {
    callback()
  }
}
// 数组验证
const array = (rule, value, callback) => {
  if (value.length === 0 || value === null || value === undefined) {
    callback(new Error('不允许为空'))
  } else {
    callback()
  }
}
export { notEmpty, email, array }
