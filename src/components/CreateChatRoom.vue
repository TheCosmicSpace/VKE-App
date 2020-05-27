<template>
  <vs-dialog overflow-hidden v-model="open">
    <template #header>
      <h3>
        Creating a room
      </h3>
    </template>
    <div class="con-content">
      <div class="create-chat">
        <!-- Photo Chat Room -->
        <div class="create-chat__photo">
          <input  @change="onFileSelected" class="create-chat__fileselect" accept="image/*" type="file">  
          <vs-avatar circle size="60">
            <img v-if="getTempURL" :src="getTempURL" alt="">
            <i v-else class='bx bxs-camera' ></i>
          </vs-avatar>
        </div>
        <!-- Setting Inputs -->
        <div class="create-chat__settings">
          <!-- Title Room -->
          <div class="create-chat__title">
            <vs-input color="dark" v-model="room.title" border autocomplete="off" placeholder="Name" />
          </div>
          <!-- SecretKey Room -->
          <div class="create-chat__secretKey">
            <vs-input color="dark" v-model="room.secretKey" border icon-after autocomplete="off" placeholder="Secret Key">
              <template #icon>
              <i class='bx bx-lock-open-alt'></i>
            </template>
            </vs-input>
          </div>
          <div class="create-chat__group">
            <!-- Read Only Checkbox Room -->
            <div class="create-chat__readOnly">
            <vs-checkbox color="dark" v-model="room.readOnly">
              Read Only
            </vs-checkbox>
            </div>
            <!-- Send From Btn -->
            <div class="create-chat__send">
              <vs-button
                @click="sendForm"
                dark
                flat
                active
                :loading="sending"
                :disabled="isDisabled">
                Create
              </vs-button>
            </div>
          </div> 
        </div>
      </div>
    </div>
  </vs-dialog>
</template>

<script>
import { mapActions } from 'vuex'
  export default {
    computed: {
      isDisabled(){
        return !(this.room.title && this.room.secretKey)
      },
      getTempURL(){
        return this.tempURL
      }
    },
    methods: {
      ...mapActions([
        'uploadRoomPhoto',
        'createChatRoom'
      ]),
      // Open/Close Dialog
      toggle(){
        this.open = !this.open
      },
      // Select Room Photo
      onFileSelected(e){
        this.selectedFile = e.target.files[0]
        // Delete prev temp url
        URL.revokeObjectURL(this.tempURL)
        // Create temp url
        if(this.selectedFile) this.tempURL = URL.createObjectURL(this.selectedFile)
        else this.tempURL = null
      },
      // Send From
      async sendForm(){
        this.sending = true
        try{
          // Upload file and await response url
          const url = this.selectedFile ? 
          await this.uploadRoomPhoto({
            path: 'chatsPhoto',
            photo: this.selectedFile
          }) : null

          const roomData = {
            ...this.room,
            photoURL: url
          }
          const room = await this.createChatRoom(roomData)
          this.sending = false
          this.open = false
          setTimeout(()=>this.$router.push({name: 'ChatItem', params: room}), 0)
        }
        catch(err){
          console.log(err);
        }
      }
    },
    data:() => ({
      open: false,
      tempURL: null,
      selectedFile: null,
      sending: false,
      // room
      room: {
        title: '',
        secretKey: '',
        readOnly: false
      }
    })
  }
</script>


<style lang="scss">
  @import '@/style/CreateChatRoomComponent/style.scss';
</style>