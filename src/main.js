import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { Button, Select } from 'element-ui';

Vue.use(Button);
Vue.use(Select);

Vue.config.productionTip = false

new Vue({
	store,
	router,
	render: h => h(App),
}).$mount('#app')




// element-ui按需加载：https://github.com/ElementUI/babel-plugin-component/edit/master/src/core.js
