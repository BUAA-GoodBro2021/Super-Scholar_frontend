import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: ()=>import('../views/Welcome.vue')
    },
    {
      path: '/user/:tokenid',
      name: 'UserDetail',
      component: ()=>import('../views/User/UserDetail.vue')
    }
  ]
})

export default router
