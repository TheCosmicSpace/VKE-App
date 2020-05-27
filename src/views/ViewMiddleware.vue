<template>
  <div class="view-middleware">
    <div v-if="device" class="not-mobile">
      <div class="view-middleware__img">
        <img src="https://media1.giphy.com/media/jHXFE0Bypb9M4/giphy.gif?cid=790b76115c6705add0391240ea8de31072eb71ab35ea3cc1&amp;rid=giphy.gif" alt="Animated GIF">
      </div>
      <p class="view-middleware__title">
        Sorry, this application only works on mobile devices
      </p>
    </div>
    <div v-if="browser" class="browser">
      <div class="view-middleware__img">
        <img src="../assets/ChromiumIcon.png" alt="ChromiumIcon">
      </div>
      <p class="view-middleware__title">
        Sorry, you need to install Google Chrome in order to use this application.
      </p>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    device(){
      return this.typeMiddleware === 'device'
    },
    browser(){
      return this.typeMiddleware === 'browser'
    },
    typeMiddleware(){
      return this.$route.params.typeMiddleware
    }
  },
  created(){
    if(!this.$route.params.typeMiddleware)
      this.$router.go(-2)
      // this.$router.push({name: 'Posts'})
  }
}
</script>

<style lang="scss">
  @import '@/style/ViewMiddlewarePage/style.scss';
</style>
