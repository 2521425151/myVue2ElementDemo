import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// 按需引入 element ui
import '@/assets/styles/needToElementUI.scss' // 公用样式
import needToElementUI from '@/utils/static/needToElementUI' // 需要使用的组件
// 开发环境下使用 mock
process.env.NODE_ENV !== 'production' && require('./mock/mock.ts')
Vue.config.productionTip = false
Vue.use(needToElementUI)
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
