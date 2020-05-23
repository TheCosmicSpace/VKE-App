<template>
  <div class="message-unit">
    <div :class="{'scoped': isScopedMessage}" class="message">
      <div class="message-view">
        <div class="avatar">
          <img src="https://images.wallpaperscraft.ru/image/chelovek_skala_kamen_150751_300x168.jpg" alt="">
        </div>
        <div class="content">
          <div class="autor-name">Jhon Smith</div>
          <div v-if="message.photoURL" class="photo">
            <img :src="message.photoURL" alt="">
          </div>
          <div class="text">{{message.content}}</div>    
        </div>
      </div>
      <div class="timestapm">12.05.2020</div>
    </div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
  export default {
    name: 'MessageUnit',
    props: ['message'],
    computed:{
      ...mapGetters([
        'getUser'
      ]),
      isScopedMessage(){
        return this.message.userId === this.getUser.id 
      }
    },
    data:()=>({
    }),
  }
</script>

<style lang="scss" scoped>
.message{
  display: flex;
  align-items: flex-start;
  margin: 20px 0;
  justify-content: space-between;
  &-view{
    display: flex;
  }
  &.scoped{
    .timestapm,
    .content{
      order: -1;
    }
    .avatar,
    .autor-name{
      display: none;
    }
    .content{
      margin-right: 0;
      border-radius: 25px 25px 2px 25px;
      background: rgba($main-color, .8);
    }
  }
}
.avatar img{
  width: 35px;
  height: 35px;
  min-width: 35px;
  min-height: 35px;
  object-fit: cover;
  border-radius: 50%;
}
.autor-name{
  font-style: italic;
  padding: 3px 0;
  @include setFontSize(10px);
}
.content{
  padding: 10px;
  color: $text-color;
  background: #28293D;
  border-radius: 2px 25px 25px 25px;
  margin-left: 5px;
  margin-right: 10px;
  @include setFontSize(14px);
  .photo{
    border-radius: 10px;
    img{
      margin: 0 auto;
      display: block;
      border-radius: 8px;
      max-width: 100%;
      max-height: 350px;
    }
  }
}
.timestapm{
  align-self: center;
  @include setFontSize(10px)
}
</style>