<template>
  <div class="chat">
    <!-- Chat Header -->
      <div class="chat-header">
        <GoBackRoute class="chat-backRoute"/>
        <div class="chat-header__content">
        <vs-avatar size="45" circle>
            <img v-if="chatPhoto" :src="chatPhoto">
            <i v-else class='bx bxs-camera' ></i>
        </vs-avatar>
        <div class="chat-room__info info">
          <div class="info__top">
            <div class="info__title">
              <span class="info__icon"><i class='bx bxs-group' ></i></span>
              <span>{{chatTitle}}</span>
            </div>  
          </div>
          <div class="info__footer">
            <div class="info__lastMsg info__lastMsg">
              <span class="info__lastUserName">Users: </span>{{chatUserLen}}
            </div>
          </div>
        </div>
                    
        </div>
      </div>  
    <!-- Chat Header -->

    <!-- MEssage Area -->
    <div class="messages-area-wrap" v-chat-scroll="{always: false, smooth: true,}" @v-chat-scroll-top-reached="customMethod">
      <div class="messages-area">
        <MessageUnit
          v-for="message in getMessagesArea"
          :key="message.id"
          :message="message" 
          :authorsMessageCollection="authorsMessageCollection"
          @setAuthorMessage="setAuthorMessage"/>
      </div>  
    </div>

    <!-- Create Message -->
    <div class="create">
      <CreateMessage
        v-if="!isReadOnly" 
        :chatId="chatId" />
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
        'getMessagesArea',
        'getUser'
      ]),
      getChatData(){
        return this.chatData || {}
      },
      chatId(){
        return this.getChatData.id
      },
      chatPhoto(){
        return this.getChatData.photoURL
      },
      chatTitle(){
        return this.getChatData.title
      },
      chatUserLen(){
        if (!this.getChatData.users) return 
        this.getChatData.users.length
      },
      isReadOnly(){
        return this.getChatData.readOnly &&
          this.getUser.id !== this.getChatData.adminId &&
          !this.getUser.admin
      }
    },
    methods: {
      ...mapActions([
        'getChatRoomMessagesById',
        'getShapshotMessage',
        'dectroyMessagesArea'
      ]),
      async customMethod(){
        if(!this.chatId) return
        await this.getChatRoomMessagesById(this.chatId)
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
      const { chatId, roomData } = this.$route.params

      if(!roomData) this.$router.replace({name: 'Chats'})
      this.chatData = roomData
      await this.dectroyMessagesArea()
      await this.getChatRoomMessagesById(chatId)
      await this.getShapshotMessage(chatId)
    }
  }
</script>


<style lang="scss">
  @import '@/style/ChatItemPage/style.scss';
</style>

<style lang="scss" scoped>
  @import '@/style/ChatItemPage/style_scoped.scss';
</style>