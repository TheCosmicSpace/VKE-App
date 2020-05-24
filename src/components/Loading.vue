<template>
  <div class="center">
    <div ref="content" class="content-div"></div>
  </div>
</template> 
<script>
  const loadingTypeMap = ["points", "default", "scale", "circles"]
  export default {
    computed: {
      getRandomTypeLoading(){
        return loadingTypeMap[Math.random() * loadingTypeMap.length | 0]
      }
    },
    methods: {
      openLoading() {
        const loading = this.$vs.loading({
          target: this.$refs.content,
          type: this.getRandomTypeLoading,
          color: "#E57373"
        })
      }
    },
    mounted(){
      this.openLoading()
    }
  }
</script>


<style lang="scss">
  @import '@/style/LoadingComponent/style.scss';
</style>

<style lang="scss" scoped>
  @import '@/style/LoadingComponent/style_scoped.scss';
</style>
