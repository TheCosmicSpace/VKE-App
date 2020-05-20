<template>
  <div class="auth-wrap">
    <div class="auth-form">
      <h2 class="auth-form-title">
        <span v-text="isLoggingIn ? 'Login' : 'Register'"></span>
      </h2>
      <form @submit.prevent="handleSubmit" class="form">
        <div class="form-wrap">
          <!-- <transition-group name="modal" mode="out-in"> -->
          <div class="input-group">
            
            <!-- Username input -->
            <vs-input
              v-if="!isLoggingIn"  
              v-model="user.username" 
              :disabled="processing" 
              placeholder="User name"
              class="form-input">
              <template #icon>
                <i class='bx bx-user'></i>
              </template>
            </vs-input>
            
            <!-- Email input -->
            <vs-input 
              v-model="user.email" 
              :disabled="processing"
              class="form-input" 
              placeholder="Email">
              <template #icon>
                <i class='bx bx-mail-send'></i>
              </template>
            </vs-input>

            <!-- Password input -->
            <vs-input
              v-model="user.password"
              :disabled="processing"
              :progress="getProgress"
              :visiblePassword="hasVisiblePassword"
              class="form-input"
              type="password"
              placeholder="Password"
              @click-icon="hasVisiblePassword = !hasVisiblePassword">
              <template #icon>
                <i v-if="!hasVisiblePassword" class='bx bx-show-alt'></i>
                <i v-else class='bx bx-hide'></i>
              </template>
            </vs-input>
            
            <!-- Password repeat-->
            <vs-input 
              v-if="!isLoggingIn" 
              v-model="user.confirmPassword"
              :disabled="processing"
              :success="getPasswordMatch" 
              class="form-input"
              type="password" 
              placeholder="Confirm password">
              <template #icon>
                <i class='bx bx-lock-open-alt' ></i>
              </template>
            </vs-input>

          </div>

          <!-- Button -->
          <vs-button
            flat
            :loading="processing"
            class="form-btn">
              <i v-if="isLoggingIn" class='bx bx-right-arrow-alt'></i>
              <i v-else class='bx bx-check' ></i>
          </vs-button>
        <!-- </transition-group> -->
        </div>
      </form>  
      <!-- <p v-if="isLoggingIn" class="forgot">Forgot?</p>   -->
      <vs-button
        :disabled="processing"
        transparent
        @click="toggleForm"
        class="toggleForm">
        <span v-text="isLoggingIn ? 'Register' : 'Login'"/>
      </vs-button>
    </div>    
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
  export default {
    name: 'Auth',
    methods:{
      ...mapActions([
        'registerUser',
        'loginUser',
        'saveUserToCollection',
        'updateProfile'
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
      // Toggle Form 
      toggleForm(){
        this.isLoggingIn = !this.isLoggingIn
      },
      // Toggle Processing
      toggleProcessing(state){
        this.processing = state
      },
      // Submit Form
      handleSubmit(){
        // Processing to true
        this.toggleProcessing(true)
        // Select start login or register logic
        this.isLoggingIn ? this.login() : this.register()
      },
      // Login logic
      async login() {
        try{
          // Call action loginUser in store
          await this.loginUser(this.user)
          this.$router.push({name: "Posts"})
          // this.$router.go()
        }
        catch(err){
          console.log(err)  
          // Notification on Error
          this.openNotification({
            title: parseErrorTitle(err.code),
            text: err.message
          })
        }
        finally{
          setTimeout(()=>this.toggleProcessing(false), 500)
        }
      },
      // Registration logic
      async register() {
        const { password, confirmPassword } = this.user 
        if(password !== confirmPassword) {
          this.toggleProcessing(false)
          // Notification on Error
          this.openNotification({
            title: "Invalid Password"
          })
          return
        }
        try{
          // Call action registerUser in store
          await this.registerUser(this.user)
          this.$router.push({name: "Posts"})
        }
        catch(err){
          console.log(err)
          // Notification on Error
          this.openNotification({
            title: parseErrorTitle(err.code),
            text: err.message
          })
        }
        finally{
          setTimeout(()=>this.toggleProcessing(false), 500)
        }
      }
    },
    data:() => ({
      user:{
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
      },
      hasVisiblePassword: false,
      isLoggingIn: true,
      processing: false
    }),
    computed: {
      ...mapGetters([
        'getUser',
        'checkUser'
      ]),
      // Check to Password Match 
      getPasswordMatch(){
        return (this.user.password === this.user.confirmPassword && this.user.password !== '')
      },

      // Get Progress Password
      getProgress() {
        let progress = 0
        // at least one number
        if (/\d/.test(this.user.password)) progress += 20
        // at least one capital letter
        if (/(.*[A-Z].*)/.test(this.user.password)) progress += 20
        // at menons a lowercase
        if (/(.*[a-z].*)/.test(this.user.password)) progress += 20
        // more than 5 digits
        if (this.user.password.length >= 6) progress += 20
        // at least one special character
        if (/[^A-Za-z0-9]/.test(this.user.password)) progress += 20
        return this.isLoggingIn ? null : progress
      }
    }
  }
  // Encapsulation logic
  // Learn RegExp, it's shit
function parseErrorTitle(error){
  return error.split("/").splice(-1).toString().split("-").map(item => item.charAt(0).toUpperCase() + item.slice(1)).join(" ")
}
</script>

<style lang="scss">
  @import '@/style/AuthPage/style.scss';
</style>