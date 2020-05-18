<template>
  <div class="auth-wrap">
    <div class="auth-form">
      <h2 class="auth-form-title">
        <span v-text="isLoggingIn ? 'Login' : 'Register'"></span>
      </h2>
      <form @submit.prevent="handleSubmit" class="form">
        <div class="form-wrap">
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
          this.$router.replace({name: "Posts"})
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
          this.$router.replace({name: "Posts"})
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

<style>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s
}

.fade-enter, .fade-leave-active {
  opacity: 0
}
  .auth-wrap{
    height: 100vh;
    /* background: #FEFEFE; */
    background: #FEFEFE url('../assets/gradient-abstract-background.jpg') no-repeat center center;
    background-size: cover; 
    background-attachment: fixed;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

  }
  .auth-form{
    width: 100%;
  }
  .auth-form-title{
    text-align: center;
    color: #20202b;
    font-size: 40px;
    margin-bottom: 50px;
  }      
  .form{  
    display: flex;
    flex-direction: column;
  }
  .form-wrap{
    position: relative;
    width: 85%;  
  }
  .input-group{
    background: #fff;
    border-top-right-radius: 100px;
    border-bottom-right-radius: 100px; 
    box-shadow: 5px 0px 28px -10px rgba(30, 30, 46, 0.25);
    overflow-x: hidden;
  }
  .form-input .vs-input{ 
    border-radius: 0;
    padding: 15px;
    width: 80%;
    background: inherit;
    padding-left: 55px;
  } 
  .form-input .vs-input:focus.vs-input--has-icon:not(.vs-input--has-icon--after){
    padding-left: 50px;
  }
  .form-input .vs-input__label{
    padding-left: 10px;
  }
  .form-input .vs-input__icon{
    margin-left: 10px;
    user-select: none;
    -webkit-tap-highlight-color: rgba(0,0,0,0);
  }
  .form-input:nth-child(2) .vs-input{
    /* z-index: 1; */
  }
  /* input:-internal-autofill-selected{
    background: fff !important;
    color: inherit !important;
  } */
  .form-btn{
    width: 50px;
    height: 50px;
    position: absolute;
    top: 50%;
    right: -25px;
    transform: translateY(-55%);
    border-radius: 50%; 
    color:#fff; 
    font-size: 25px;
    background: linear-gradient(90deg, #15C5CF, #30E3A4);
  }
  .forgot{
    padding: 20px 20px 0 0;
    text-align: right;
    font-weight: 600;
    color: #CCCED0;  
    font-size: 14px;
  }
  .toggleForm{
    color: #EF9C8D;
    font-size: 15px;
    font-weight: 600;
    margin: 25px 0;
    padding: 0px 15px;
    background: none;
    border-radius: 0;
    border-top-right-radius: 25px;
    border-bottom-right-radius: 25px;
    box-shadow: 2px 5px 15px -8px rgba(30, 30, 46, 0.25);
  }
  .toggleForm:hover::before{
    opacity: 0;
  }
@media (max-width: 600px){
  .vs-notification{
    border-bottom-left-radius: 10px !important;
    border-bottom-right-radius: 10px !important;
  }
}

  /* .vs-notification vs-notification--color vs-notification--sticky vs-notification--danger notification-enter-to */
</style>