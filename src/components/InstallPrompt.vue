<template>
  <div class="install-prompt">
    <div class="center">
      <vs-dialog prevent-close v-model="active">
        <template #header>
          <h4 class="not-margin">
            Welcome to <b>VKE App</b>
          </h4>
        </template>
        <div class="con-form">
          <p class="con-form-text">You need install this application</p>
        </div>
        <template #footer>
          <div class="footer-dialog">
            <vs-button @click="installApp" block>
              Download App
            </vs-button>
          </div>
        </template>
      </vs-dialog>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
  export default {
    name: 'InstallPrompt',
    computed: {
      ...mapGetters([
        'installPrompt'
      ])
    },
    methods: {
      ...mapMutations([
        'setInstallPrompt'
      ]),
      installApp(){
        this.installPrompt.prompt()
        this.installPrompt.userChoice
        .then(choiceResult => {
          console.log(choiceResult);
          if(choiceResult.outcome === 'accepted')
            this.setInstallPrompt(null)
        })
      },
    },
    data:() => ({
      active: true
    })
  }
</script>

<style lang="scss">
  @import '@/style/InstallPromptComponent/style.scss';
</style>