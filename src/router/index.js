import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store'
import { sync } from 'vuex-router-sync'
import Echo from '@/utils/echo'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/components/Login.vue')
  },
  {
    path: '/register', 
    name: 'Register',
    component: () => import('@/components/Register.vue')
  },
  {
    path: '/home',
    name: 'Home',
    meta: { tabbar: true, verify: true },
    component: () => import('@/components/Home.vue')
  },
  {
    path: '/message',
    name: 'Message', 
    meta: { verify: true, transition: true },
    component: () => import('@/components/Message.vue')
  },
  {
    path: '/my',
    name: 'My',
    meta: { tabbar: true, verify: true },
    component: () => import('@/components/My.vue')
  },
  {
    path: '/setting',
    name: 'Setting',
    meta: { verify: true, transition: true },
    component: () => import('@/components/Setting.vue')
  }
]

const router = new VueRouter({
  routes
})

// 同步路由状态到vuex
sync(store, router)

// 路由守卫
router.beforeEach((to, from, next) => {
  // 处理路由动画方向
  if (router.isBack) {
    router.isBack = false
    if (from.matched.some(res => res.meta.transition)) {
      store.commit('updateDirection', { direction: 'reverse' })
    }
  } else if (to.matched.some(res => res.meta.transition)) {
    store.commit('updateDirection', { direction: 'forward' })
  } else {
    store.commit('updateDirection', { direction: '' })
  }

  // 验证用户登录状态
  let verifyJump = false
  if (to.matched.some(res => res.meta.verify)) {
    if (!window.localStorage.getItem('authUser')) {
      verifyJump = true
    } else {
      // 初始化Echo连接
      if (!window.client) {
        Echo.run()
      }
    }
  }

  if (verifyJump) {
    next({ path: '/login' })
  } else {
    next()
  }
})

export default router