import Vue from 'vue'
import Router from 'vue-router'
import layout from '../layout/index.vue'
Vue.use(Router)

const PCRouter = [
    {
        path:'/',
        redirect:'/home'
    },
    {
        name:'/home',
        path:'/home',
        component:layout

    },
    {
        name: '/VModel',
        path: '/VModel',
        component:() => import('../view/VModel/index.vue'),
        meta:{
            title: '父子组件传参双向绑定'
        }
    },
    {
        name: '/SlotTest',
        path: '/SlotTest',
        component:() => import('../view/slotTest/index.vue'),
        meta:{
            title: 'VUE插槽'
        }
    },
]

const router = new Router({
    beforeEach(to, from, next){
        next()
    },
    afterEach(to, from, next){
        next()
    },
    routes:PCRouter
})

export default router
