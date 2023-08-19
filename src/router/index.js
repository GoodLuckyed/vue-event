import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store/index'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: () => import('@/views/layout'),
    redirect: '/home',
    children: [
      {
        path: 'home',
        component: () => import('@/views/Home')
      },
      {
        path: 'user-info',
        component: () => import('@/views/User/userInfo')
      },
      {
        path: 'user-avatar',
        component: () => import('@/views/User/userAvatar')
      },
      {
        path: 'user-pwd',
        component: () => import('@/views/User/userPwd')
      },
      {
        path: 'art-cate',
        component: () => import('@/views/Article/artCate')
      },
      {
        path: 'art-list',
        component: () => import('@/views/Article/artList')
      }
    ]
  },
  {
    path: '/reg',
    component: () => import('@/views/Register')
  },
  {
    path: '/login',
    component: () => import('@/views/Login')
  }
]

const router = new VueRouter({
  routes
})

// 路由的白名单
const whiteList = ['/login', '/reg']

// 全局前置路由守卫 （路由发生跳转时执行）  // 第一次进入项目页面会触发路由守卫
router.beforeEach((to, from, next) => {
  const token = store.state.token
  if (token) {
    // 有token但是没有用户信息, 才去请求用户信息保存到vuex里
    // 调用actions里方法请求数据
    if (token && !store.state.userInfo.username) {
      store.dispatch('initUserInfo')
    }
    // 路由放行
    next()
  } else {
    // 判断路由的地址是否在白名单中
    if (whiteList.includes(to.path)) {
      next()
    } else {
      // 强制跳转到登录页
      next('/login')
    }
  }
})

export default router
