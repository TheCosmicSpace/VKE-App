<template>
  <div>
    <!-- Preview Photo Dialog -->
    <template>
      <vs-dialog class="photo-preview" overflow-hidden v-model="openPreloadPhoto">
        <div class="con-content create-message">
          <img :src="getTempURL" class="create-msg__photo"/>
          <div class="create-msg__title">
            <vs-input color="dark" v-model="msgContent" border autocomplete="off" placeholder="Message" />
            <vs-button
              :disabled="isDisabled"
              @click="sendMsg"
              borderd
              class="create-msg__btn">
                Send
            </vs-button>
          </div>
        </div>
      </vs-dialog>
    </template>
    <!--  -->

    <!-- Create message "Input" -->
    <div class="create-msg">
      <div class="create-msg__icon">
        <input @change="onFileSelected" class="msg-photo" type="file" ref="loadChatPhoto" accept="image/*" tabindex="-1" >
        <i class='bx bx-image-add'></i>
      </div>
      <div ref="msgValue" class="create-msg__content" @input="enterMessage" contenteditable="true" spellcheck="false"></div>
      <div class="create-msg__emoji"
        @click="openEmoji = !openEmoji">
        <i class='bx bx-happy-beaming' ></i>
      </div>
      <vs-button
          :disabled="isDisabled"
          circle
          icon
          @click="sendMsg"
          class="create-msg__send">
          <i class="bx bxs-paper-plane"></i>
      </vs-button>
    </div>
    <transition name="emoji-view" mode="out-in">
      <VEmojiPicker v-if="openEmoji" class="emoji" @select="selectEmoji" />
    </transition>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import VEmojiPicker from 'v-emoji-picker'
  export default {
    name: 'CreateMessage',
    components: {
      VEmojiPicker
    },
    computed: {
     getTempURL(){
        return this.tempURL
      },
      isDisabled(){
        return !this.msgContent.trim() && !(this.selectedFile && this.openPreloadPhoto)
      }
    },
    methods: {
      ...mapActions([
        'uploadRoomPhoto',
        'tempMessage',
      ]),
      // Notification
      openNotification({title, text}, color = 'danger', position = 'top-center') {
        const noti = this.$vs.notification({
          color,
          position,
          title: title,
          text: text
        })
      },
      selectEmoji(emoji) {
        this.$refs.msgValue.textContent += emoji.data
        this.msgContent += emoji.data
        console.log(emoji)
      },
      enterMessage(){
        this.msgContent = this.$refs.msgValue.textContent
      },
      async sendMsg(){
        try{
          const messageData = {
            chatId: this.chatId,
            content: this.msgContent,
            photo: this.selectedFile
          }
          this.msgContent = this.selectedFile = this.$refs.msgValue.textContent = ''
          this.openPreloadPhoto = false
          const messageId = await this.tempMessage(messageData)
        }
        catch(err){
          console.log(err);
        } 
      },
      // Select photo message
      onFileSelected(e){
        this.selectedFile = e.target.files[0]
        // Check size
        const size = (this.selectedFile.size / (1024**2)).toFixed(1);
        if(size > 5){
          this.openNotification({
            text: 'Maximum size: 5 MB',
            title: 'File is too large'
          })
          this.selectedFile = null
          return e.target.value= ''
        }
        // Delete prev temp url
        URL.revokeObjectURL(this.tempURL)
        // assuming that this file has any extension
        const extension = this.selectedFile.name.match(/(?<=\.)\w+$/g)[0].toLowerCase();

        if(!['jpg', 'jpeg', 'png', 'svg', 'webp'].includes(extension)){
          this.openNotification({
            text: 'The file must be a file of type: jpg | png | svg | webp',
            title: 'Invalid file type'
          })
          this.tempURL = null
          this.selectedFile = null
          this.openPreloadPhoto = false
        }
        else{
          this.tempURL = URL.createObjectURL(this.selectedFile)
          this.msgContent = this.$refs.msgValue.textContent
          this.$refs.msgValue.textContent = ''
          this.openPreloadPhoto = true
        }
        e.target.value= ''
      }
    },
    watch: {
      openPreloadPhoto(value){
        if(!value) {
          this.msgContent = ''
          this.selectedFile = null
        }
      }
    },
    props: ['chatId'],
    data:()=>({
      msgContent: '',
      openPreloadPhoto: false,
      openEmoji: false,
      tempURL: null,
      selectedFile: null,
    }),
    created(){
    }
  }
</script>

<style lang="scss">
  @import '@/style/CreateMessageComponent/style.scss';
</style>

<style lang="scss" scoped>
  @import '@/style/CreateMessageComponent/style_scoped.scss';
</style>