<template>
  <div class=""> 
    <div class="chat">
      <!-- Chat Header -->
        <div class="chat-header">
          <GoBackRoute class="chat-backRoute"/>
          <div class="chat-header__content">
          <vs-avatar size="45" circle>
              <img v-if="getChatPhoto" :src="getChatPhoto">
              <i v-else class='bx bxs-camera' ></i>
          </vs-avatar>
          <div class="chat-room__info info">
            <div class="info__top">
              <div class="info__title">
                <span class="info__icon"><i class='bx bxs-group' ></i></span>
                <span>{{chatData.title}}</span>
              </div>  
            </div>
            <div class="info__footer">
              <div class="info__lastMsg info__lastMsg">
                <span class="info__lastUserName">Users: </span>{{chatData.users.length}}
              </div>
            </div>
          </div>
                      
          </div>
        </div>  
      <!-- </div> -->
      <!-- Chat Header -->

      <!-- MEssage Area -->
      <div class="messages-area" v-chat-scroll="{always: false, smooth: true,}" @v-chat-scroll-top-reached="customMethod">
          <MessageUnit
            v-for="message in getMessagesArea"
            :key="message.id"
            :message="message" 
            :authorsMessageCollection="authorsMessageCollection"
            @setAuthorMessage="setAuthorMessage"/>
      </div>

      <!-- Create Message -->
      <div class="create">
        <CreateMessage 
          :chatId="chatData.id" />
      </div>
    </div>
  </div>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'
  import CreateMessage from '@/components/CreateMessage.vue'
  import MessageUnit from '@/components/MessageUnit.vue'
  import Loading from '@/components/Loading.vue'
  import GoBackRoute from '@/components/GoBackRoute.vue'
  export default {
    name: 'ChatItem',
    components: {
      CreateMessage,
      MessageUnit,
      GoBackRoute,
      Loading
    },
    computed: {
      ...mapGetters([
        'getMessagesArea'
      ]),
      getChatPhoto(){
        return this.chatData.photoURL
      },
    },
    methods: {
      ...mapActions([
        'getChatRoomMessagesById',
        'getShapshotMessage',
        'dectroyMessagesArea'
      ]),
      async customMethod(){
        console.log("TOP LINE");
        await this.getChatRoomMessagesById(this.chatData.id)
      },
      setAuthorMessage({userId, userData}){
        this.authorsMessageCollection[userId] = userData
        // console.log(this.authorsMessageCollection);
      }
    },
    data:()=>({
      chatData: {},
      authorsMessageCollection: {}
    }),
    async created(){
      console.log(this.$route.params);
      const { chatId, roomData } = this.$route.params
      if(!roomData) this.$router.replace({name: 'Chats'})
      this.chatData = roomData
      console.log(this.chatData);
      await this.dectroyMessagesArea()
      await this.getChatRoomMessagesById(chatId)
      await this.getShapshotMessage(chatId)
    },
    destroyed(){
    }
  }
</script>


<style lang="scss">
  @import '@/style/ChatItemPage/style.scss';
</style>

<style lang="scss" scoped>
  @import '@/style/ChatItemPage/style_scoped.scss';
</style>