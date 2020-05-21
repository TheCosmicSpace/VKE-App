<template>
  <vs-dialog overflow-hidden v-model="active">
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
        this.active = !this.active
      },
      // Select Room Photo
      onFileSelected(e){
        this.selectedFile = e.target.files[0]
        // Delete prev temp url
        URL.revokeObjectURL(this.tempURL)
        // Create temp url
        if(this.selectedFile) this.tempURL = URL.createObjectURL(this.selectedFile)
        else this.tempURL = null
        console.log(this.selectedFile)
      },
      // Send From
      async sendForm(){
        this.sending = true
        try{
          // Upload file and await response url
          const url = this.selectedFile ? await this.uploadRoomPhoto(this.selectedFile) : null
          const roomData = {
            ...this.room,
            photoURL: url
          }
          const roomId = await this.createChatRoom(roomData)
          console.log(roomId);
        }
        catch(err){
          console.log(err);
        }
        this.sending = false
      }
    },

    data:() => ({
      active: false,
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


<style lang="stylus" scoped>
 getColor(vsColor, alpha = 1)
      unquote("rgba(var(--vs-"+vsColor+"), "+alpha+")")
  getVar(var)
      unquote("var(--vs-"+var+")")
  .con-content
    display flex
    align-items center
    justify-content center
    p
      margin 20px 0px
      position relative
      display block
      font-size .9rem
  .not-margin
    margin 0px
    font-weight normal
    padding 10px
  .con-form
    width 100%
    .flex
      display flex
      align-items center
      justify-content space-between
      a
        font-size .8rem
        opacity .7
        &:hover
          opacity 1
    .vs-checkbox-label
      font-size .8rem
    .vs-input-content
      margin 10px 0px
      width calc(100%)
      .vs-input
        width 100%
  .footer-dialog
    display flex
    align-items center
    justify-content center
    flex-direction column
    width calc(100%)
    .new
      margin 0px
      margin-top 20px
      padding: 0px
      font-size .7rem
      a
        color getColor('primary') !important
        margin-left 6px
        &:hover
          text-decoration underline
    .vs-button
      margin 0px
</style>