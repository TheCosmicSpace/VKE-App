<template>
  <div class="key-input">
    <vs-input v-model="key" autocomplete="off" placeholder="Secret Key"/>
    <vs-button
      @click="checkToSecretKey"
      icon>
      <i class='bx bxs-send'></i>
    </vs-button>
  </div>
</template>

<script>
  export default {
    props: ['secretKey'],
    methods: {
      openNotification(position = null, color) {
        const noti = this.$vs.notification({
          duration: 1500,
          icon: `<i class='bx bx-error' ></i>`,
          color,
          position,
          title: 'Invalid Secret Key',
          text: `Try again`
        })
      },
      checkToSecretKey(){
        if (this.secretKey === this.key) this.$emit('comeToChat')
        else this.openNotification('bottom-center', 'warn')
      }
    },
    data:()=>({
      key: '',
    })
  }
</script>


<style lang="scss">
  @import '@/style/RoomMiddlewareComponent/style.scss';
</style>

<style lang="scss" scoped>
  @import '@/style/RoomMiddlewareComponent/style_scoped.scss';
</style>
