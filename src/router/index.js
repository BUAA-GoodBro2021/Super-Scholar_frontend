import { ElMessage } from 'element-plus';
import { createRouter, createWebHistory } from 'vue-router'
import {useGlobalStore} from "../stores/global"
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Welcome',
      component: ()=>import('../views/Welcome.vue'),
    },
    {
      path: '/account',
      name: 'Account',
      component: ()=>import('../views/account/Login.vue'),
      children:[
        // 登录
        {
          path: 'login',
          name: 'Login',
          meta:{
            transition: "animate__fadeInDown"
          },
          component: ()=>import('../views/account/LoginForm.vue'),
        },
        // 注册
        {
          path: 'register',
          name: 'Register',
          meta:{
            transition: "animate__fadeInDown"
          },
          component: ()=>import('../views/account/RegisterForm.vue'),
        },
      ]
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
          path: 'user/:tokenid',
          name: 'UserDetail',
          component: ()=>import('../views/User/UserDetail.vue'),
        },
        {
          path: 'openalex/author/:tokenid',
          name: 'OpenAlexAuthorDetail',
          component: ()=>import('../views/User/AuthorAccount.vue'),
        },
        {
          path: 'personal/account',
          name: 'PersonalDetail',
          component: ()=>import('../views/User/PersonalDetail.vue'),
        },
        {
          path: 'claimportal',
          name: 'ClaimPortal',
          component: ()=>import('../views/User/ClaimPortal.vue'),
        },
        {
          path: 'collection',
          name: 'Collection',
          component: ()=>import('../views/User/Collection.vue'),
        },
        {
          path: 'paper/:paperid',
          name: 'PaperDetail',
          component: ()=>import('../views/paper/PaperDetail.vue'),
        },
        // 临时加一个路由页面，用于调试搜索详情页面，后续调整其位置
        {
          path: '/search-detail',
          name: 'SearchDetail',
          component: ()=>import('../views/search/SearchDetail.vue'),
        }
      ],
    },
    
  ]
})
// 全局前置守卫
router.beforeEach((to,from)=>{
    // TODO: 权限
    const globalStore = useGlobalStore();
    if(!globalStore.isAuth&&to.name!="Login"&&to.name!="Welcome"&&to.name!="Register"){
      return{name:"Login"};
    }
})
export default router
