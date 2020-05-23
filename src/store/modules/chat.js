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
    chatRoomsCollection: null,
    emptyResStatus: false,
    prevTypeRooms: 'scoped'
  },
  mutations: {
    // Set chat rooms collection
    setChatRoomsCollection: (state, collection) => state.chatRoomsCollection = collection,
    // Set Rersonse Status
    setEmptyResStatus: (state, status) => state.emptyResStatus = status,
    // Change prev type rooms
    changePrevTypeRooms: (state, type) => state.prevTypeRooms = type
  },
  actions: {
  // ===== Set actions ===== //

    // Upload Room Photo
    async uploadRoomPhoto({commit}, {path, photo}){
      const storageRef = await firebase.storage().ref(`${path}/${UUID()}`).put(photo)
      return storageRef.ref.getDownloadURL()
    },
    // Create Chat Room  
    async createChatRoom({commit, dispatch, getters}, payload){
      const { id, displayName } = getters.getUser
      const data = {
        ...payload,
        adminId: id,
        createAt: Date.now(),
        count: 0,
        messages: [],
        users: [id]
      }
      console.log(data);
      // Create Chat Room 
      const docRef = await firebase.firestore().collection('chats').add(data)
      // Add first message
      await dispatch('sendMessage', {
        chatId: docRef.id,
        content: `${displayName} created chat room!`
      }) 
      console.log(docRef);
      return docRef.id
    },
    async joinUserToChatRoom({commit, getters}, chatId){
      const { id } = getters.getUser
      const docRef = await firebase.firestore().collection('chats').doc(chatId)
      return await docRef.update({
        users: firebase.firestore.FieldValue.arrayUnion(id),
      })
    },
    // Send messages to chat (chatId)
    async sendMessage({commit, getters}, {chatId, content, photoURL = null}){
      const { id } = getters.getUser
      const data = {
        userId: id,
        content,
        photoURL,
        createAt: Date.now()
      }
      const docRef = await firebase.firestore().collection('chats').doc(chatId)
      return await docRef.update({
        messages: firebase.firestore.FieldValue.arrayUnion(data),
        count: firebase.firestore.FieldValue.increment(1)
      })
    },

  //===== Get actions ===== //
    //Get Chat Room by id
    async getChatRoomById({commit}, chatId){
      const chatsRef = await firebase.firestore().collection('chats')
      return await (await chatsRef.doc(chatId).get()).data()
    } ,
    // Get Chat Rooms
    async getChatRooms({commit, dispatch, getters}, typeRooms){
      // Load
      if(getters.prevTypeRooms !== typeRooms) commit('setEmptyResStatus', false)
      // Change prev type rooms 
      commit('changePrevTypeRooms', typeRooms)
      // Ref on chats collection
      const chatsRef = await firebase.firestore().collection('chats')
      const { id } = getters.getUser
      // Check on type rooms
      let chatRooms = []
      if(typeRooms === 'scoped'){
        // Get scoped rooms
        chatRooms = await chatsRef.where('users', 'array-contains', id).get()
      }  
      else if(typeRooms === 'global'){
        // Get global rooms 
        chatRooms = await chatsRef.get()
      }
      // Set empty response
      if(chatRooms.empty){
        commit('setChatRoomsCollection', null)  
        commit('setEmptyResStatus', chatRooms.empty)
        return
      }
      const chatRoomsCollection = await dispatch('constructCollection', chatRooms)
      // Set chat romm collection
      commit('setChatRoomsCollection', chatRoomsCollection)
    },
    // Construct Room Collections
    async constructCollection({commit}, rooms){
      return await rooms.docs.map(doc => ({... doc.data(), id: doc.id}))
    }
  },
  getters: {
    getCollection: state => state.chatRoomsCollection,
    emptyResStatus: state => state.emptyResStatus,
    prevTypeRooms: state => state.prevTypeRooms
  }
}
