import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/storage'

// Generate random str form named room photo
function UUID(){
  return (Date.now() + Math.floor(Math.random() * 100)).toString()
}

export default {
  state: {
  },
  mutations: {
  },
  actions: {
    // Upload Room Photo
    async uploadRoomPhoto({commit}, photo){
      const storageRef = await firebase.storage().ref(`chatsPhoto/${UUID()}`).put(photo)
      return storageRef.ref.getDownloadURL()
    },
    // Create Chat Room  
    async createChatRoom({commit, getters}, payload){
      const { id } = getters.getUser
      const data = {
        ...payload,
        adminId: id,
        createAt: Date.now(),
        count: 0,
        messages: [],
        users: []
      }
      console.log(data);
      const docRef = await firebase.firestore().collection('chats').add(data)
      console.log(docRef);
      return docRef.id
    }
  },
  getters: {
  }
}
