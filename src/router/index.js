import Vue from 'vue';
import Router from "vue-router";
import login from "../components/login";
import home from "../components/home.vue";
import welcome from "../components/welcome";
import homeUsers from "../components/homeUsers";
import homeRights from "../components/homeRights";
import homeList from "../components/homeList";
import el from "element-ui/src/locale/lang/el";
import goodsCarter from "../components/goodsCarter";
import paramsList from "../components/paramsList";
import goodsList from "../components/goodsList";
import addGoods from "../components/addGoods";
import order from "../components/order";
import report from "../components/report";

Vue.use(Router)

const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

const router = new Router({
  mode:'history',
  routes:[
    { path:'/' , redirect:'/login' },
    { path:'/login' , component:login },
    { path:'/home' , component:home, redirect: '/welcome',
      children:[{path:'/welcome', component:welcome},
        {path: '/users',component: homeUsers},
        {path: '/rights',component: homeRights},
        {path: '/roles',component: homeList},
        {path:'/categories',component: goodsCarter},
        {path:'/params',component: paramsList},
        {path:'/goods',component: goodsList},
        {path:'/addGoods',component: addGoods},
        {path:'/orders',component: order},
        {path:'/reports',component: report},
      ]
    },
  ]
})
export default router

router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next()
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})


