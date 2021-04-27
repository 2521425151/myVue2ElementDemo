export const checkoutUserArent = (): Boolean => {
  let userArent = true
  if (
    /AppleWebKit.*Mobile/i.test(navigator.userAgent) ||
    /MIDP|SymbianOS|NOKIA|SAMSUNG|LG|NEC|TCL|Alcatel|BIRD|DBTEL|Dopod|PHILIPS|HAIER|LENOVO|MOT-|Nokia|SonyEricsson|SIE-|Amoi|ZTE/.test(
      navigator.userAgent
    )
  ) {
    if (window.location.href.indexOf('?mobile') < 0) {
      try {
        if (/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)) {
          //手机
          userArent = false
        } else if (/iPad/i.test(navigator.userAgent)) {
          // 平板
          userArent = false
        } else {
          // PC
          userArent = true
        }
      } catch (e) {
        console.log(e)
      }
    }
  }
  return userArent
}
