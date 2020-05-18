import Vue from 'vue'
import Vuex from 'vuex'
// Modules
import user from './modules/user'
import post from './modules/post'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    user,
    post
  },
  strict: process.env.NODE_ENV !== 'production'
})
