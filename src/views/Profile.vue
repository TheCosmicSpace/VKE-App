<template>
  <div class="profile">
    <!-- :style="{background: `linear-gradient(${generateRandomColor}, #fff)`}" -->
    <div class="gradient" :style="{background: generateRandomColor}">
      <h2 class="profile__title page-title">
        <span class="page-title__text">Profile</span>
      </h2>
    </div>

    <vs-avatar size="140" class="profile__img">
      <img v-if="getUser.photoURL" :src="getUser.photoURL">
      <i v-else class='bx bx-user'></i>
      <!-- Edit Avatar -->
      <div v-if="edit" :style="{backgroundImage: getTempURL}" class="profile__edit-photo">
        <input type="file" @change="onFileSelected" accept="image/*" tabindex="-1" class="profile__edit-photo"/>
      </div>
    </vs-avatar>

    <div class="profile__name">
      <p v-if="!edit" class="profile__username">{{getUser.displayName}}</p>
       <vs-input v-if="edit" border v-model="editDisplayName" class="profile__edit-username"/>
      <!-- <input v-if="edit" type="text" v-model="editData.displayName" class="profile__edit-username">   -->
    </div>
    <div v-if="!checkByAdmin" class="profile__upgrade">
      <vs-switch v-model="upgrade">
        <template #on>
          Admin
        </template>
        <template #off>
          Default
        </template>
      </vs-switch>
      <div v-if="upgrade" class="key-input-admin">
        <vs-input v-model="key" placeholder="Secret Key"/>
        <vs-button
          @click="checkToSecretKey"
          :loading="secretKeySending"
          icon>
          <i class='bx bxs-send'></i>
        </vs-button>
      </div>
    </div>
    <div class="profile__btn-group">
      <!-- Log Out Btn -->
      <vs-button
        circle
        danger
        border
        @click="logout"
        class="profile__btn">
        <i class='bx bx-log-out-circle' style="margin-right: 5px"></i> LogOut
      </vs-button>
      
      <!-- Edit Profile Btn -->
      <vs-button
        circle
        border
        :loading="processing"
        @click="editClick"
        :color="edit ? 'success' : 'primary'"
        class="profile__btn">
        <span v-if="!edit">
          <i class='bx bx-edit'></i>
          Edit profile
        </span>
        <span v-else>
          <i class='bx bxs-message-square-check'></i>
          Save changes
        </span>
      </vs-button>

    </div> 
  </div>
</template>

<script>
// import { createNamespacedHelpers } from 'vuex'
// const { mapActions, mapGetters } = createNamespacedHelpers('user/')
import {mapActions, mapGetters} from 'vuex'
  export default {
    name: "Profile",
    methods: {
      ...mapActions([
        'logoutUser',
        'uploadFile',
        'updateProfile',
        'upgradeToAdmin',
        'saveChangesToCollection'
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
      async checkToSecretKey(){
        this.secretKeySending = true
        try{
          const res = await this.upgradeToAdmin(this.key)
          if(!res){
            this.secretKeySending = false
            this.openNotification({
              text: 'Try again',
              title: 'Invalid secret key'
            })
            return this.key = ''
          } 
          
        }catch(err){
          console.log(err)
        }
        this.secretKeySending = false
      },
      async logout(){
        try{
          await this.logoutUser()
          this.$router.replace({name: "Auth"})
        }catch(err){
          console.log(err)
        }
      },
       // Toggle Processing
      toggleProcessing(state){
        this.processing = state;
      },
      // File Selected 
      onFileSelected(e){
        this.selectedFile = e.target.files[0]
        // Check size
        const size = (this.selectedFile.size / (1024**2)).toFixed(1);
        if(size > 3){
          this.openNotification({
            text: 'Maximum size: 3 MB',
            title: 'File is too large'
          })
          this.selectedFile = null
          return e.target.value= ''
        }
        // Delete prev temp url
        URL.revokeObjectURL(this.tempURL)
        // assuming that this file has any extension
        const extension = this.selectedFile.name.match(/(?<=\.)\w+$/g)[0].toLowerCase()
        if(!['jpg', 'jpeg', 'png', 'svg', 'webp'].includes(extension)){
          this.openNotification({
            text: 'The file must be a file of type: jpg | png | svg | webp',
            title: 'Invalid file type'
          })
          this.tempURL = null
          this.selectedFile = null
          return e.target.value= ''
        }
        // Create temp url
        if(this.selectedFile) this.tempURL = URL.createObjectURL(this.selectedFile)
        else this.tempURL = null
      },  
      async editClick(){
        const { displayName, photoURL } = this.getUser
        if(this.edit) {
          this.toggleProcessing(true) 
          // No Changes
          if(!this.selectedFile && this.editDisplayName === displayName) return (this.toggleProcessing(false), this.edit = false)
          // Too Large
          if(this.editDisplayName.length > 30 || this.editDisplayName.length < 3){
            //Error
            this.openNotification({
              title: 'Invalid User Name',
              text: 'Username must contain 3-30 characters'
            })
            return (this.toggleProcessing(false), this.edit = false)
          }
          try{
            const url = this.selectedFile ? await this.uploadFile(this.selectedFile) : photoURL
            const editData = {
              displayName: this.editDisplayName,
              photoURL: url
            }
            // Update Profile
            await this.updateProfile(editData)
            // Save Changes To Collection
            await this.saveChangesToCollection(editData)
            // Show Notification
            this.openNotification({title: "Changes saved"}, "success")
            this.selectedFile = null
            this.tempURL = null
          }
          catch(err){
            // Show Error
            this.openNotification({title: "Error", text: err}, "danger")
          }
          this.toggleProcessing(false)
          this.edit = false
        }
        else{
          this.edit = true;
          this.editDisplayName = displayName
        } 
      }
    },
    data:() => ({
      editDisplayName: null,
      selectedFile: null,
      tempURL: null,
      processing: false,
      edit: false,
      upgrade: false,
      key: '',
      secretKeySending: false
    }),
    computed: {
      ...mapGetters([
        'getUser',
        'checkByAdmin'
      ]),
      // generateRandomColor(){
      //   return '#' + Math.random().toString(16).slice(-6);
      // }
      getTempURL(){
        return `url(${this.tempURL})`
      },
      generateRandomColor(){
        return colorsMap[Math.random() * colorsMap.length | 0]
      }
    },
  }
  const colorsMap = ["#ffb4a2", "#4ecdc4","#7bf1a8",  "#e2afff", "#ff6b6b", "#73b1d8", "#49dcb1"]
</script>


<style lang="scss">
  @import '@/style/ProfilePage/style.scss';
</style>

<style lang="scss" scoped>
   @import '@/style/ProfilePage/style_scoped.scss';
</style>
