import Vue from 'vue'
import Vuex from 'vuex'
// Modules
import user from './modules/user'
import post from './modules/post'
import chat from './modules/chat'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    user,
    post,
    chat
  },
  strict: process.env.NODE_ENV !== 'production'
})
