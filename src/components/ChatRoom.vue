<template>
  <div class="chat-room" @click="selectRoom">
    <div :class="{'showSecret': true}" class="chat-room__borderLine">
      <RoomMiddleware v-if="true" class="room-middleware"/>
    </div>
    <div class="chat-room__photo">
       <vs-avatar size="50" circle>
        <img src="https://images.wallpaperscraft.ru/image/chelovek_skala_kamen_150751_1280x720.jpg" alt="">
      </vs-avatar>
    </div>
    <div class="chat-room__info info">
      <div class="info__top">
        <div class="info__title">
          <span class="info__icon"><i class='bx bxs-group' ></i></span>
          <span>Some TitleSome TitleSome TitleSome TitleSome TitleSome TitleSome TitleSome TitleSome TitleSome TitleSome Title</span>
        </div>
        <div class="info__createAt">17.05.2020</div>  
      </div>
      <div class="info__footer">
        <div class="info__lastMsg">
          <span class="info__lastUserName">Some Name: </span>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quo eum, iure laboriosam quas at labore quae illo, perferendis et assumenda rerum aperiam. Quod perspiciatis expedita suscipit magni libero corporis? Veniam?
        </div>
        <div class="info__counterMsg">6</div>
      </div>
    </div>
  </div>
</template>

<script>
import RoomMiddleware from '@/components/RoomMiddleware.vue'
  export default {
    components: {
      RoomMiddleware
    },
    methods: {
      selectRoom(){
        // this.roomMiddleware = !this.roomMiddleware 
      }
    },
    data:()=>({
      roomMiddleware: false
    })
  }
</script>

<style lang="scss" scoped>
  @import '@/style/ChatRoomComponent/style_scoped.scss';
</style>