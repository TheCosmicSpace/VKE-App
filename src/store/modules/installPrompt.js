export default {
  state: {
    installPrompt: null
  },
  mutations: {
    setInstallPrompt: (state, payload) => state.installPrompt = payload
  },
  actions: {
  },
  getters: {
    installPrompt: state => state.installPrompt,
    canInstallPrompt: state => {
      return 'BeforeInstallPromptEvent' in window && 
      state.installPrompt instanceof BeforeInstallPromptEvent
    }
  }
}
