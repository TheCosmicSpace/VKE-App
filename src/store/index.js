import Vue from 'vue'
import Vuex from 'vuex'
// Modules
import user from './modules/user'
import post from './modules/post'
import chat from './modules/chat'
import deviceDetector from './modules/deviceDetector'
import installPrompt from './modules/installPrompt'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    user,
    post,
    chat,
    deviceDetector,
    installPrompt
  },
  strict: process.env.NODE_ENV !== 'production'
})
