// element 样式
import 'element-ui/packages/theme-chalk/src/tooltip.scss'
import 'element-ui/packages/theme-chalk/src/select.scss'
import 'element-ui/packages/theme-chalk/src/option.scss'
import 'element-ui/packages/theme-chalk/src/date-picker.scss'
// element 组件
// import Tooltip from 'element-ui/lib/tooltip'
// import Select from 'element-ui/lib/select'
// import Option from 'element-ui/lib/option'
// import DatePicker from 'element-ui/lib/date-picker'
import { Tooltip, Select, Option, DatePicker } from 'element-ui'

// element 组件数组
const components = [Tooltip, Select, Option, DatePicker]
// 自定vue义注册方法 vm 默认指向调用它的对象， main.js中 vue.use(elementComponents); 所以vm指向Vue
export default {
  install: (vm: any) => {
    components.forEach(item => {
      vm.component(item.name, item)
    })
  }
}
