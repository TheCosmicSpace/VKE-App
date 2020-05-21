<template>
  <div>
    <div class="key-input">
      <vs-input v-model="key" autocomplete="off" placeholder="Secret Key"/>
      <vs-button
        @click="checkToSecretKey"
        :loading="secretKeySending"
        icon>
        <i class='bx bxs-send'></i>
      </vs-button>
    </div>
  </div>
</template>

<script>
  export default {
    methods: {
      checkToSecretKey(){

      }
    },
    data:()=>({
      secretKeySending: false,
      key: ''
    })
  }
</script>


<style lang="scss">
  @import '@/style/RoomMiddlewareComponent/style.scss';
</style>

<style lang="scss" scoped>
  @import '@/style/RoomMiddlewareComponent/style_scoped.scss';
</style>
