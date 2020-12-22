import Vue from 'vue'
import Router from 'vue-router'
import home from '../views/home'


Vue.use(Router)

export default new Router({
  routes: [
    {path: "/", redirect: "/login"},
    {
      path: "/login",

      component: resolve => require(['@/views/login'], resolve),
      meta: {title: '营销网络合作平台 - 登陆'}
    },
    {
      path: "/home",
      component: home,
      meta: {title: '营销网络合作平台 - 首页'}
    },
  ]
})
