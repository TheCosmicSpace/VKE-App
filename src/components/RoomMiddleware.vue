<template>
  <div class="key-input">
    <vs-input v-model="key" autocomplete="off" placeholder="Secret Key"/>
    <vs-button
      @click="checkToSecretKey"
      :loading="loading"
      icon>
      <i class='bx bxs-send'></i>
    </vs-button>
  </div>
</template>

<script>
  import { mapActions } from 'vuex'
  export default {
  props: ['secretKey', 'chatId'],
  methods: {
    ...mapActions([
      'joinUserToChatRoom'
    ]),
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
    async checkToSecretKey(){
      if (this.secretKey === this.key){
        this.loading = true
        try{
          await this.joinUserToChatRoom(this.chatId)
          this.$emit('comeToChat')
        }catch(err){
          console.log(err);
        }
        this.loading = false
      }
      else this.openNotification('top-center', 'warn')
    }
  },
  data:()=>({
    key: '',
    loading: false
  })
  }
</script>


<style lang="scss">
  @import '@/style/RoomMiddlewareComponent/style.scss';
</style>

<style lang="scss" scoped>
  @import '@/style/RoomMiddlewareComponent/style_scoped.scss';
</style>
