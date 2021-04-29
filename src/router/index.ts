import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes: RouteConfig[] = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    // 这将为该路由生成一个单独的块 about[hash].js
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/login',
    name: 'login',
    // webpackMode 的默认值为 lazy 它会使所有异步模块都会被单独抽离成单一的 chunk
    // 若设置该值为 lazy-once，Webpack 就会将所有带有标记的异步加载模块放在同一个 chunk 中。
    component: () => import(/* webpackMode: lazy-once */ '../views/About.vue')
  }
]
// 使用 require.context 动态加载modules文件的 router 模块
const requiredModules = require.context('./modules', false, /\.ts$/)
requiredModules.keys().forEach(fileName => {
  routes.push(...(requiredModules(fileName).default || requiredModules(fileName)))
})

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
