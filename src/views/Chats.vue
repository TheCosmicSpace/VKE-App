<template>
  <div class="chats">
    <!-- Create Chat Room Dialog -->
    <CreateChatRoom ref="CreateChatRoom"/>
    <!-- Title -->
    <h2 class="chats-title page-title">
      <span class="page-title__text">Chats</span>
      <vs-button
        v-if="checkByAdmin"
        @click="openCreateChatRoomDialog"
        circle
        icon
        floating
        class="create-btn">
        <i class='bx bx-plus' ></i>
      </vs-button>
    </h2>
    <!-- Search Line -->
    <Search
      :searchNameRoom="searchNameRoom"
      @searchRoom="searchRoom" 
      @toggleTypeRooms="toggleTypeRooms" 
      ref="Search"/>
    <!-- ChatRooms -->
    <div class="chats-rooms">
      <!-- Show chat rooms -->
      <template v-if="!noneChatRooms">
        <ChatRoom 
          v-for="chat in filteredCollection"
          :currentTypeRooms="currentTypeRooms"
          :key="chat.id" 
          :roomData="chat"/>
      </template>
      <!-- Show alert -->
      <NoneRooms v-if="noneChatRooms"/>
    </div>
    <!-- Loadig -->
    <Loading v-if="!emptyResStatus && loadingRooms" />
  </div>
</template>

<script>
import Search from '@/components/Search.vue'
import Loading from '@/components/Loading.vue'
import NoneRooms from '@/components/NoneRooms.vue'
import ChatRoom from '@/components/ChatRoom.vue'
import CreateChatRoom from '@/components/CreateChatRoom.vue'

import { mapGetters, mapActions } from 'vuex'
  export default {
    name: 'Chats',
    components: {
      Search,
      Loading,
      NoneRooms,
      ChatRoom,
      CreateChatRoom
    },
    computed: {
      ...mapGetters([
        'emptyResStatus',
        'checkByAdmin',
        'getCollection',
        'getUser'
      ]),
      filteredCollection(){
        if(!this.getCollection) return
        return this.getCollection.filter(room => {
          return room.title.toLowerCase().includes(this.searchNameRoom.toLowerCase())
        })
      },
      noneChatRooms(){
        return this.emptyResStatus && !this.getCollection
      }
    },
    methods: {
      ...mapActions([
        'getChatRooms'
      ]),

      // Create Chat Room Logic
      createChatRoom(){
        console.log("create");
      },
      searchRoom(nameRoom){
        this.searchNameRoom = nameRoom
        console.log(nameRoom);
      },
      // Toggle type room logic
      async toggleTypeRooms(typeRooms){
        if(!this.getUser) return
        this.currentTypeRooms = typeRooms
        this.loadingRooms = true
        try{
          await this.getChatRooms(typeRooms)
        }catch(err){
          console.log("TYPE ROOMS", err)
        }
        this.loadingRooms = false  
      },
      //Open Create Chat Room Dialog 
      openCreateChatRoomDialog(){
        this.$refs.CreateChatRoom.toggle()
      }
    },
    data:()=>({
      loadingRooms: true,
      currentTypeRooms: '',
      searchNameRoom: ''
    }),
    watch: {
      getUser(){
        console.log("Watch", this.getUser);
        this.toggleTypeRooms(this.$refs.Search.typeRooms);
      }
    },
    created(){
    }
  }
</script>


<style lang="scss" >
  @import '@/style/ChatsPage/style.scss';
</style>

<style lang="scss" scoped>
  @import '@/style/ChatsPage/style_scoped.scss';
</style>