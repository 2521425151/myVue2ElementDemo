// 节流
export const throttle = (fn: Function, wait: number = 300): Function => {
  let inThrottle: boolean, lastFn: any, lastTime: number
  return function () {
    const context = this
    let args = arguments
    if (!inThrottle) {
      fn.apply(context, args)
      lastTime = Date.now()
      inThrottle = true
    } else {
      clearTimeout(lastFn)
      lastFn = setTimeout(() => {
        if (Date.now() - lastTime >= wait) {
          fn.apply(context, args)
          lastTime = Date.now()
        }
      }, Math.max(wait - (Date.now() - lastTime), 0))
    }
  }
}
// 防抖
export const debounce = (fn: Function, wait: number = 300): Function => {
  let lastFn: any
  return function () {
    const context = this
    let args = arguments
    if (lastFn) {
      clearTimeout(lastFn)
    }
    lastFn = setTimeout(() => {
      lastFn = null
      fn.apply(context, args)
    }, wait)
  }
}
