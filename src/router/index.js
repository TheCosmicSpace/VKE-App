import Vue from 'vue'
import VueRouter from 'vue-router'
import Posts from '../views/Posts.vue'

import initMiddleware from "./initMiddleware.js"

Vue.use(VueRouter)

const routes = [
  {
    path: '/view-middleware',
    name: 'ViewMiddleware',
    component: () => import('../views/ViewMiddleware.vue'),
  },
  {
    path: '/',
    name: 'Posts',
    component: Posts,
    meta: {
      middleware: ['checkMobileDevice', 'checkBrowser']
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
    path: '/chats',
    name: 'Chats',
    component: () => import('../views/Chats.vue'),
    meta: {
      middleware: ['checkMobileDevice', 'checkBrowser', 'isAuth']
    },
  },
  {
    path: '/chats/:chatId',
    name: 'ChatItem',
    component: () => import('../views/ChatItem.vue')
  },
  {
    path: '/auth',
    name: 'Auth',
    component: () => import('../views/Auth.vue'),
    meta: {
      middleware: ['checkMobileDevice', 'checkBrowser']
    }
  },
  {
    path: '/profile',
    name: 'Profile',
    meta: {
      middleware: ['checkMobileDevice', 'checkBrowser', 'isAuth']
    },
    component: () => import('../views/Profile.vue')
  },
  {
    path: '/*',
    redirect: {name: 'Posts'}
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

initMiddleware(router);

export default router
