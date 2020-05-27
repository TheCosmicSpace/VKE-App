import Vue from 'vue'
import VueChatScroll from 'vue-chat-scroll'
import Vuesax from 'vuesax'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'

import firebase from 'firebase/app'
import 'firebase/auth' 
import firebaseConfig from './firebase.config'
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

import 'vuesax/dist/vuesax.css' //Vuesax styles
import 'material-icons/iconfont/material-icons.css'

Vue.use(Vuesax, {})
Vue.use(VueChatScroll)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App),
  created(){
    this.$store.commit('setDeviseDetector')
    // Save session
    firebase.auth().onAuthStateChanged(async user => {
      await this.$store.dispatch("stateChanged", user)
    })
  },
}).$mount('#app')

window.addEventListener('beforeinstallprompt', e => {
  e.preventDefault()
  store.commit('setInstallPrompt', e)
})
