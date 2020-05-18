import Vue from 'vue'
import VueRouter from 'vue-router'
import Posts from '../views/Posts.vue'

import initMiddleware from "./initMiddleware.js"

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Posts',
    component: Posts,
    meta: {
      middleware: ['checkMobileDevice']
    },
  },
  {
    path: '/posts/:postId',
    name: 'PostItem',
    props: true,
    component: () => import('../views/PostItem.vue')
  },
  {
    path: '/add-post',
    name: 'AddPost',
    component: () => import('../views/AddPost.vue')
  },
  {
    path: '/auth',
    name: 'Auth',
    component: () => import('../views/Auth.vue')
  },
  {
    path: '/profile',
    name: 'Profile',
    meta: {
      middleware: ['isAuth']
    },
    component: () => import('../views/Profile.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

initMiddleware(router);

export default router
