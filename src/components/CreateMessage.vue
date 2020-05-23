<template>
  <div class="cr">
    <div class="container">
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
      <vs-button
          :disabled="isDisabled"
          circle
          icon
          @click="sendMsg">
          <i class="bx bxs-paper-plane"></i>
        </vs-button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
  export default {
    name: 'CreateMessage',
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
          this.msgContent = this.$refs.msgValue.textContent = ''
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
        // Delete prev temp url
        URL.revokeObjectURL(this.tempURL)
        // assuming that this file has any extension
        const extension = this.selectedFile.name.match(/(?<=\.)\w+$/g)[0].toLowerCase();
        console.log(extension, "extension");
        
        if(!['jpg', 'jpeg', 'png', 'svg', 'webp'].includes(extension)){
          this.tempURL = null
          this.openPreloadPhoto = false
        }
        else{
          this.tempURL = URL.createObjectURL(this.selectedFile)
          this.msgContent = this.$refs.msgValue.textContent
          this.$refs.msgValue.textContent = ''
          this.openPreloadPhoto = true
        }
        console.log(extension);
        e.target.value= ''
      }
    },
    watch: {
      openPreloadPhoto(value){
        if(!value) this.msgContent = ''
      }
    },
    props: ['chatId'],
    data:()=>({
      msgContent: '',
      openPreloadPhoto: false,
      tempURL: null,
      selectedFile: null,
    }),
    created(){
    }
  }
</script>

<style lang="scss">
.photo-preview{
  .vs-dialog{
    background: $postCard-bg;
    color: $text-color; 
    &__content{
      max-height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
    &__close{
      .vs-icon-close{
        opacity: 1;
        &::before,
        &::after{
          background: $main-color;
        }
      }
    }
  }
  .create-msg{
    &__title{
      margin: 30px auto 0 auto;
      .vs-input-parent--border .vs-input-content .vs-input{
        width: 100%;
        color: $text-color;
      }
      width: 80%;
    }
  }
}
.chat-header{
  .vs-avatar img{
      height: 100%;
      object-fit: cover;
    }
}
</style>

<style lang="scss" scoped>
.create-msg{
  position: relative;
  box-shadow: 0px 0px 35px -20px rgba($main-color, 0.95);
  display: flex;
  align-items: center;
  background: #28293D;
  padding: 5px 10px;
  border-radius: 10px;
  justify-content: space-between;
  &__btn{
    margin: 10px auto 0 auto;
  }
  &__photo{
    max-width: 100%;
    max-height: 350px;
    display: block;
    margin: 0 auto;
    border-radius: 8px;
  }
  &__icon{
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    @include setFontSize(25px);
    .msg-photo{
      position: absolute;
      width: 100%;
      height: 100%;
      left: 0;
      top: 0;
      opacity: 0;
      z-index: 9;
    }
  }
  &__content{
    width: calc(100% - 70px);
    -webkit-user-modify: read-write;
    overflow-wrap: break-word;
    -webkit-line-break: after-white-space;
    @include setFontSize(14px);
    border: none;
    padding: 8px 10px;
    border-radius: inherit;
    max-height: 80px;
    overflow: hidden;
    overflow-y: auto;
    outline: none;
    word-break: break-word;
    cursor: text;
    &:focus {
      outline: 0;
    }
  }
  .vs-button{
    margin: 0;
    &--default:hover{
      transform: none;
    }
  }
}
</style>