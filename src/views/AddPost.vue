<template>
  <div class="addPost">
    <h2 class="page-title">
      <span class="page-title__text">Add Post</span>
    </h2>
    <div class="addPost__fields">
      <div class="addPost-title">
        <div class="addPost-title__input">
          <vs-input
            warn
            v-model="postTitle"
            @input="checkLimit"
            label="Post's Title"/>

            <div class="progress">
              <ProgressText
                class="progress-circle"
                :titleLimit="titleLimit"
                :getLengthPostTitle="getLengthPostTitle"
                />  
            </div>
        </div>
      </div>  

      <div class="addPost-photo">
        <div class="addPost-photo__label">
          <span>Preview Photo</span>
          <div class="addPost-photo__select">
            <vs-button
              :disabled="!postPhoto"
              circle
              @click="deletePhoto"
              color="danger"
              class="addPost-photo__btn">
              <span>
                Delete Photo
              </span>
            </vs-button>
          </div>
        </div> 
        <div class="addPost-upload">
          <input type="file" @change="photoTarget" accept="image/*" class="addPost-upload__input"/>  
          <div class="addPost-upload__frame" :style="{backgroundImage: getTempURL}"></div>  
        </div> 
      </div>

      <div class="addPost-text">
        <div class="addPost-text__label">Post's Text</div>
        <textarea class="addPost-text__textarea" placeholder="Write here post's text!" v-model="postText"></textarea>
      </div>
      <vs-button
        @click="toSend"
        :icon="success"
        :loading="sending"
        :color="success ? 'success' : 'primary'">
        <span v-if="!success">
          <i class='bx bx-mail-send' ></i>
            Send
        </span>
        <i class='bx bx-check' v-else ></i>
      </vs-button>  
    </div>
  </div>
</template>

<script>
import ProgressText from "@/components/ProgressText.vue"
import { mapActions, mapGetters } from 'vuex'
export default {
  name: "AddPost",
  components: {
    ProgressText
  },
  methods: {
    ...mapActions([
      'sendPost'
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
    photoTarget(e){
      this.postPhoto = e.target.files[0] || this.postPhoto
      // Delete prev temp url
      URL.revokeObjectURL(this.tempURL)
      // Create temp url
      if(this.postPhoto) this.tempURL = URL.createObjectURL(this.postPhoto)
      else this.tempURL = null
    },
    deletePhoto(){
      // Delete prev temp url
      URL.revokeObjectURL(this.tempURL)
      this.tempURL = null
      this.postPhoto = null
    },
    toSend(){
      if(this.success){
        this.postTitle = ''
        this.postText = ''
        this.postPhoto = null
        this.sending = false
        this.success = false 
        return false
      }
      this.sending = true
      const postData = {
        postTitle: this.postTitle,
        postText: this.postText,
        postPhoto: this.postPhoto
      }
      this.sendPost(postData)
      .then(res => {this.success = true})
      .catch(err => {
        console.log(err)  
        // Notification on Error
        this.openNotification({
          title: err.code,
          text: err.message
        })
      })
      .finally(()=>{this.sending = false})
    }
  },
  data: ()=>({
    postTitle: '',
    postText: '',
    postPhoto: null,
    tempURL: null,
    success: false,
    sending: false,
    titleLimit: 50 
  }),
  computed: {
    ...mapGetters([
      'getUser'
    ]),
    getLengthPostTitle(){
      return this.postTitle.length
    },
    checkLimit(){
      this.postTitle = this.postTitle.slice(0, this.titleLimit)
    },
    getTempURL(){
      return `url(${this.tempURL})`
    },
  },
  created(){
    if(!(this.getUser && this.getUser.admin)) this.$router.go(-1)
  }
}
</script>


<style lang="scss">
  @import '@/style/AddPostPage/style.scss';
</style>

<style lang="scss" scoped>
  @import '@/style/AddPostPage/style_scoped.scss';
</style>