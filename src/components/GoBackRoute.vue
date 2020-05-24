<template>
  <div>
    <vs-button
        @click="goBackRoute"
        color="#E57373"
        circle
        icon
        floating
        class="backRoute">
        <i class='bx bx-left-arrow-alt' ></i>
      </vs-button>
  </div>
</template>

<script>
export default {
  methods:{
    goBackRoute(){
      this.$router.go(-1)
    }
  }
}
</script>

<style lang="scss">
</style>