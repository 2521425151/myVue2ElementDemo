import Vue from 'vue'
import Router from 'vue-router'
// import homPage from '../view/homePage'
const homPage = () => import('../view/homePage')
Vue.use(Router)

const PCRouter = [
    {
        path:'/',
        redirect:'/homPage'
    },
    {
        name:'/homPage',
        path:'/homPage',
        component:homPage

    }
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
