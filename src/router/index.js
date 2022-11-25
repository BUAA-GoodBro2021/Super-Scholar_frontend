import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Welcome',
      component: ()=>import('../views/Welcome.vue'),
    },
    // 登录
    {
      path: '/login',
      name: 'Login',
      component: ()=>import('../views/account/Login.vue'),
    },
    // 注册
    {
      path: '/register',
      name: 'Register',
      component: ()=>import('../views/account/Register.vue'),
    },
    // 管理端
    {
      path: '/admin',
      component: ()=>import('../views/admin/Index.vue'),
      meta:{
        requiresAdmin: true,
        requiresAuth: true,
      },
      children: [],
    },
    // 客户端
    {
      path: '/client',
      component: ()=>import('../views/client/Index.vue'),
      meta:{
        requiresAdmin: false,
        requiresAuth: true,
      },
      children: [
        {
          path: '/user/:tokenid',
          name: 'UserDetail',
          component: ()=>import('../views/User/UserDetail.vue'),
        },
        {
          path: '/personal/account',
          name: 'PersonalDetail',
          component: ()=>import('../views/User/PersonalDetail.vue'),
        },
      ],
    }
  ]
})
// 全局前置守卫
router.beforeEach((to,from)=>{
    // TODO: 权限
})
export default router
