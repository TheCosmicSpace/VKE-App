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
      if(author) this.authorMsg = author
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
  @import '@/style/MessageUnitComponent/style.scss';
</style>