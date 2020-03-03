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
            <vs-input class="form-input" v-model="user.name" placeholder="User name">
              <template #icon>
                <i class='bx bx-user'></i>
              </template>
            </vs-input>

            <!-- Password input -->
            <vs-input
              :style="getBackgroud"
              class="form-input"
              type="password"
              v-model="user.password"
              placeholder="Password"
              :progress="getProgress"
              :visiblePassword="hasVisiblePassword"
              @click-icon="hasVisiblePassword = !hasVisiblePassword">
              <template #icon>
                <i v-if="!hasVisiblePassword" class='bx bx-show-alt'></i>
                <i v-else class='bx bx-hide'></i>
              </template>
            </vs-input>
            
            <!-- Password repeat-->
            <vs-input v-if="!isLoggingIn" class="form-input" type="password" :success="getPasswordMatch" v-model="user.confirmPassword" placeholder="Confirm password">
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
      <p v-if="isLoggingIn" class="forgot">Forgot?</p>  
      <vs-button
        transparent
        @click="toggleForm"
        class="toggleForm">
        <span v-text="isLoggingIn ? 'Register' : 'Login'"/>
      </vs-button>
    </div>    
  </div>
</template>

<script>
  export default {
    name: 'Auth',
    methods:{
      toggleForm(){
        this.isLoggingIn = !this.isLoggingIn;
      },
      handleSubmit(){
        console.log(this.user);
        this.processing = true;
        setTimeout(()=>{
          this.processing = false;
          if (this.isLoggingIn) {
              this.login();
          } else {
              this.register();
          }
        },5000);
      },
      login() {

      },
      register() {
        if (this.user.password !== this.user.confirmPassword) {
          alert("Your passwords do not match.");
          this.processing = false;
          return;
        }
      }
    },
    data:() => ({
      user:{
        name: '',
        password: '',
        confirmPassword: ''
      },
      hasVisiblePassword: false,
      isLoggingIn: true,
      processing: false
    }),
      computed: {
        getPasswordMatch(){
          return (this.user.password === this.user.confirmPassword && this.user.password !== '');
        },
        getBackgroud(){
          // return "background: linear-gradient(90deg,red,white);";
        },
        getProgress() {
          let progress = 0

          // at least one number

          if (/\d/.test(this.user.password)) {
            progress += 20
          }

          // at least one capital letter

          if (/(.*[A-Z].*)/.test(this.user.password)) {
            progress += 20
          }

          // at menons a lowercase

          if (/(.*[a-z].*)/.test(this.user.password)) {
            progress += 20
          }

          // more than 5 digits

          if (this.user.password.length >= 6) {
            progress += 20
          }

          // at least one special character

          if (/[^A-Za-z0-9]/.test(this.user.password)) {
            progress += 20
          }

          return this.isLoggingIn ? null : progress
        }
      }
    }
</script>

<style>
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
</style>