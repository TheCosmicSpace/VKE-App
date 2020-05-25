<template>
  <div class="chat-room" @click="selectRoom">
    <div :class="{'showSecret': showSecret}" class="chat-room__borderLine">
      <RoomMiddleware
        :secretKey="roomData.secretKey"
        :chatId="roomData.id"
        @comeToChat="comeToChat"
        v-if="showSecret" 
        class="room-middleware" />
    </div>
      <div :class="{'loading': loadUser}" class="chat-room__photo">
        <vs-avatar size="50" circle>
          <img v-if="getRoomPhoto" :src="getRoomPhoto">
          <i v-else class='bx bxs-camera' ></i>
        </vs-avatar>
      </div>
      <div class="chat-room__info info">
        <div class="info__top">
          <div :class="{'loading': loadUser}" class="info__title">
            <span class="info__icon"><i class='bx bxs-group' ></i></span>
            <span>{{roomData.title}}</span>
          </div>
          <div :class="{'loading': loadUser}" class="info__counterMsg info__counterMsg">{{msgCount}}</div>
        </div>
        <div class="info__footer">
          <div :class="{'loading': loadUser}" class="info__lastMsg info__lastMsg">
            <span class="info__lastUserName">{{lastMsgUser.displayName}}: </span>{{getLastMsg.content}}
          </div>
         <div :class="{'loading': loadUser}" class="info__createAt">{{lastMsgCreatedAt}}</div>
        </div>
      </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import RoomMiddleware from '@/components/RoomMiddleware.vue'
  export default {
    props: ['roomData', 'currentTypeRooms'],
    components: {
      RoomMiddleware
    },
    computed: {
      ...mapGetters([
        'getUser'
      ]),
      getRoomPhoto(){
        return this.roomData.photoURL
      },
      msgCount(){
        return this.roomData.count
      },
      getLastMsg(){
       return this.lastMsg
      },
      lastMsgCreatedAt(){
        const { createdAt } = this.getLastMsg
        const dayTime = 86400000
        const diff = Date.now() - createdAt
        if(diff > dayTime * 7) 
          return new Date(createdAt).toLocaleDateString()
        if(diff > dayTime)
          return new Date(createdAt).toDateString()
        else
          return new Date(createdAt).toLocaleTimeString()
      }
    },
    methods: {
      ...mapActions([
        'getLastMsgById',
        'getUserFromCollection',
      ]),
      // Select room check on middleware
      selectRoom(){
        const roomMiddleware = this.currentTypeRooms === 'global' && !this.checkOnIncludes()
        roomMiddleware ? this.showSecret = true : this.comeToChat()  
      },
      comeToChat(){
        this.$router.push({name: 'ChatItem', params: {chatId: this.roomData.id, roomData: this.roomData}});
        //console.log("Come to chat: ", this.roomData.id);
      },
      // Check on includes user in room
      checkOnIncludes(){
        const { id } = this.getUser
        return this.roomData.users.includes(id)
      }
    },
    data:()=>({
      showSecret: false,
      loadUser: true,
      lastMsg: {},
      lastMsgUser: ''
    }),
    async created(){
      //console.log(this.roomData.id);
      this.lastMsg = await this.getLastMsgById(this.roomData.id)
      //console.log(this.lastMsg);
      this.lastMsgUser = await this.getUserFromCollection(this.getLastMsg.userId)
      this.loadUser = false
      //console.log(this.roomData, this.currentTypeRooms);
    }
  }
</script>

<style lang="scss" >
  @import '@/style/ChatRoomComponent/style_scoped.scss';
</style>