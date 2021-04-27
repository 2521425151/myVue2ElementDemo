import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// 开发环境下使用 mock
process.env.NODE_ENV !== 'production' && require('./mock/mock.ts')

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
