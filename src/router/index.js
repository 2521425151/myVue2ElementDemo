import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)
const index = ()=>import('../views/index.vue')
const router = new Router({
    mode:'history',
    router:[
        {
            path:'/',
            name:'index',
            component:index
        },
        {
            path:'',
            name:'',
            component:''
        }
        ]
});
export default router;