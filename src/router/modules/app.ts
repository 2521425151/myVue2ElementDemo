const OrderRouter = [
  {
    path: 'orderList',
    component: () => import(/* webpackChunkName: "about" */ '@/views/About.vue')
  },
  {
    path: 'orderDetail',
    component: () => import(/* webpackChunkName: "about" */ '@/views/About.vue')
  }
]
export default OrderRouter
