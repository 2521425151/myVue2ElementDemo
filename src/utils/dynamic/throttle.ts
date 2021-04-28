export default class ActionControl {
  timeout = 0
  fn: any = null
  wait = 0
  preActionTime = 0
  constructor(fn: any, wait: number) {
    this.fn = fn
    this.wait = wait
  }
  // 防抖
  debounce(): void {
    if (this.timeout !== 0) clearTimeout(this.timeout) //清除这个定时器
    this.timeout = setTimeout(this.fn, this.wait)
  }
  // 节流
  throttle(): void {
    if (this.preActionTime === 0) {
      this.preActionTime = new Date().getTime()
      this.fn()
    } else {
      clearTimeout(this.timeout)
      const timeBetween = new Date().getTime() - this.preActionTime
      this.timeout = setTimeout(() => {
        if (timeBetween >= this.wait) {
          this.fn()
          this.preActionTime = new Date().getTime()
        }
      }, Math.max(this.wait - timeBetween, 0))
    }
  }
}
