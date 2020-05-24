<template>
  <div class="message-unit">
    <div :class="{'scoped': isScopedMessage}" class="message">
      <div class="message-view">
        <vs-avatar size="30" circle class="avatar">
          <img v-if="getPhoto" :src="getPhoto">
          <i v-else class='bx bx-user'></i>
        </vs-avatar>
        <div class="content">
          <div class="autor-name">{{getAuthor}}</div>
          <div v-if="message.photoURL" class="photo">
            <img :src="message.photoURL" alt="">
          </div>
          <div class="text">{{message.content}}</div>    
        </div>
      </div>
      <div class="timestapm">{{createdAt}}</div>
    </div>
  </div>
</template>

<script>
import {mapGetters,mapActions} from 'vuex'
  export default {
    name: 'MessageUnit',
    computed:{
      ...mapGetters([
        'getUser',
      ]),
      createdAt(){
        const { createdAt } = this.message
        const dayTime = 86400000
        const diff = Date.now() - createdAt
        if(diff > dayTime * 7) 
          return new Date(createdAt).toLocaleDateString()
        if(diff > dayTime)
          return new Date(createdAt).toDateString()
        else
          return new Date(createdAt).toLocaleTimeString()
      },
      getAuthor(){
        return this.authorMsg.displayName
      },
      getPhoto(){
        return this.authorMsg.photoURL
      },
      isScopedMessage(){
        return this.message.userId === this.getUser.id 
      }
    },
    methods: {
      ...mapActions([
        'getUserFromCollection'
      ])
    },
    props: ['message', 'authorsMessageCollection'],
    data:()=>({
      authorMsg: {}
    }),
    async created(){
      const author = this.authorsMessageCollection[this.message.userId]
      console.log(author);
      if(author) 
        this.authorMsg = author
      else{
        this.authorMsg = await this.getUserFromCollection(this.message.userId)
        this.$emit('setAuthorMessage', {
          userId: this.message.userId,
          userData: this.authorMsg
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
.message{
  user-select: none;
  display: flex;
  align-items: flex-start;
  margin: 20px 0;
  justify-content: space-between;
  // justify-content: space-around;
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
      border-radius: 15px 15px 2px 15px;
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
  border-radius: 2px 15px 15px 15px;
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