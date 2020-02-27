import Vue from 'vue'
import VueRouter from 'vue-router'
const Login = () => import('../components/Login')
const Home = () => import('../components/Home')
const Welcome = () => import('../components/Welcome')

// home下的子组件
const Users = () => import('views/users/Users')

const Rights = () => import('views/rights/Rights')
const Roles = () => import('views/rights/Roles')

const Goods = () => import('views/goods/Goods')
const Params = () => import('views/goods/Params')
const Categories = () => import('views/goods/Categories')

const Orders = () => import('views/orders/Orders')

const Reports = () => import('views/reports/Reports')


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
    component: Home,
    redirect: '/welcome',
    children: [
      { path: '/welcome', component: Welcome },
      { path: '/users', component: Users },
      { path: '/rights', component: Rights },
      { path: '/roles', component: Roles },
      { path: '/goods', component: Goods },
      { path: '/params', component: Params },
      { path: '/categories', component: Categories },
      { path: '/orders', component: Orders },
      { path: '/reports', component: Reports }
    ]
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

// 解决重复使用router.push报错问题
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

export default router
