import Vue from 'vue'
import VueRouter from 'vue-router'
import { post } from '../assets/js/axios'
import { userApi } from './api'
import  store  from '../store/store'
import {apiConfig} from "./config";

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Main',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "main" */ '../views/Main.vue'),
    children: [
      {
        path: 'user_edit',
        name: 'UserEdit',
        component: () =>
          import(/* webpackChunkName: "user_edit" */ '../components/UserEdit.vue')
      },
      {
        path: 'user_list',
        name: 'UserList',
        component: () =>
          import(/* webpackChunkName: "user_list" */ '../components/UserList.vue')
      },
      {
        path: 'role_list',
        name: 'RoleList',
        component: () =>
          import(/* webpackChunkName: "user_list" */ '../components/RoleList.vue')
      },
      {
        path: 'user_list',
        name: 'UserList',
        component: () =>
          import(/* webpackChunkName: "user_list" */ '../components/UserList.vue')
      }
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,  //BASE_URL 和 vue.config.js 中的 publicPath 选项相符
  routes
})

// 全局前置守卫
router.beforeEach((to, from, next) => {
  // 需要调用相关
  checkUserStatus(next)

})

function checkUserStatus (next) {
  // 如果验证通过了

  // 后端先获取当前页面的cookie，如果没有就从请求头中获取token参数
  // 前端获取token参数，如果不为空则加到新的参数post里面
  post(userApi.userCheckUserStatusApi).then(res => {
    // 如果已经登录了
    if (res.data.isLogin) {
      // 设置全局的userInfo
      store.dispatch('setLoginUser', res.data.userSession)
      store.dispatch('setToken', res.data.token)
    }
  }).then(next())
}

function getQueryVariable (variable) {
  var query = window.location.search.substring(1)
  var vars = query.split('&')
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split('=')
    if (pair[0] === variable) {
      return pair[1]
    }
  }
  return ''
}
export default router
