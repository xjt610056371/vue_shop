import Vue from 'vue'
import VueRouter from 'vue-router'
const Login = () => import('../components/Login')
const Home = () => import('../components/Home')


Vue.use(VueRouter)

const routes = [
  {
    path: '',
    redirect: '/login'
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/home',
    component: Home
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  // 如果访问的是login页面，直接放行
  if(to.path === '/login') return next()

  // 如果访问的是其他页面
  const tokenStr = window.sessionStorage.getItem('token')
  // 没有token，直接返回login页面
  if(!tokenStr) return next('/login')
  // 有token，放行
  next()
})

export default router
