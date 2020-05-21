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
  // ===== Set actions ===== //

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
    },

  //===== Get actions ===== //
    // Get Chat Rooms
    async getChatRooms({commit, dispatch}, typeRooms){
      if(typeRooms === "scoped")
        await dispatch("getScopedRooms")
      else if(typeRooms === "global")
        await dispatch("getGlobalRooms")
    },
    // Get Scoped Rooms
    async getScopedRooms({dispatch, getters}){
      const { id } = getters.getUser
      console.log("getScopedRooms");
      const chatsRef = await firebase.firestore().collection('chats')
      const scopedRooms = await chatsRef.where("users", "array-contains", id)
      // const scopedRoomsCollection = await dispatch("constructCollection", scopedRooms)
      console.log(scopedRooms);
    },
    // Get Global Rooms
    async getGlobalRooms({dispatch}){
      console.log("getGlobalRooms");
      const globalRooms = await firebase.firestore().collection('chats').get()
      const globalRoomsCollection = await dispatch("constructCollection", globalRooms)
      console.log(globalRoomsCollection);
    },
    // Construct Room Collections
    async constructCollection({commit}, rooms){
      return await rooms.docs.map(doc => ({... doc.data(), id: doc.id}))
    }
  },
  getters: {
  }
}
