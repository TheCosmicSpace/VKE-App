<template>
  <div ref="app" id="app">
    <InstallPrompt v-if="canInstallPrompt && notMiddleware"/>
    <transition name="view" mode="out-in">
      <router-view/>
    </transition>
    <BottomNavigation ref="BottomNavigation"/>
  </div>
</template>

<script>
import {mapGetters, mapMutations} from 'vuex'
import BottomNavigation from '@/components/BottomNavigation.vue' 
import InstallPrompt from '@/components/InstallPrompt.vue'
  export default {
    components:{
      BottomNavigation,
      InstallPrompt
    },
    computed: {
      ...mapGetters([
        'canInstallPrompt'
      ]),
      notMiddleware(){
        return this.$router.currentRoute.name !== 'ViewMiddleware'
      }
    },
    methods: {
      callEvent(state){
        this.elBottomNav.dispatchEvent(
          new CustomEvent('hideBottomNavigation', {
            detail: {state}
          }))
      }
    },
    data:()=>({
      elBottomNav: null
    }),
    mounted(){
      const { name } = this.$router.currentRoute
      this.elBottomNav = this.$refs.BottomNavigation.$el
      this.elBottomNav.addEventListener('hideBottomNavigation', (e) => {
        this.$refs.BottomNavigation.toggleHidden(e.detail.state)
      })
      // it's not cool
      window.HideBottomNav = this.callEvent
    }
  }
</script>

<style lang="scss">
// Imports
@import "./style/title";
*,*::after,*::before{
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
#app {
  font-family: Montserrat, Avenir, Helvetica, Arial, sans-serif;
  background: $theme-bg;
  min-height: 100vh;
}
ul, li{
  list-style: none;
}
a{
  color: inherit;
  text-decoration: none;
}
.d-flex{
  display: flex;
}
.container{
  padding: 0 10px;
}
.view-enter-active, .view-leave-active {
  transition: opacity .15s ease-in-out;
}
.view-enter, .view-leave-to {
  opacity: 0;
}
.view-enter-to, .view-leave {
  opacity: 1;
}
</style>
