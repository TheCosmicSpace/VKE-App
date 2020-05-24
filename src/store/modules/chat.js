import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/storage'


let lastMessages = {}, initMessagesArea = true, tempMsg = false
let unsubscribe = function (){}
// Generate random str form named room photo
function UUID(){
  return (Date.now() + Math.floor(Math.random() * 100)).toString()
}

export default {
  state: {
    chatRoomsCollection: null,
    emptyResStatus: false,
    prevTypeRooms: 'scoped',
    // ===
    messagesArea: [],
    prevMsgLen: 0,
  },
  mutations: {
    // Set chat rooms collection
    setChatRoomsCollection: (state, collection) => state.chatRoomsCollection = collection,
    // Set Rersonse Status
    setEmptyResStatus: (state, status) => state.emptyResStatus = status,
    // Change prev type rooms
    changePrevTypeRooms: (state, type) => state.prevTypeRooms = type,
    // ===
    // Set messages area 
    setMessagesArea: (state, messages) => {
      // if(state.prevMsgLen === state.prevMsgLen  + messages.length) return
      state.messagesArea.unshift(...messages)
    },
    // Set new message
    setNewMessage: (state, message) => state.messagesArea.push(...message),
    // ===
    dectroyMessagesArea: (state) => {
      state.messagesArea = []
      lastMessages = {}
      initMessagesArea = true
      tempMsg = false
      unsubscribe()
    }
  },
  actions: {
    dectroyMessagesArea({commit}){
      commit("dectroyMessagesArea")
    },  
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
        createdAt: Date.now(),
        count: 0,
        users: [id]
      }
      //console.log(data);
      // Create Chat Room 
      const docRef = await firebase.firestore().collection('chats').add(data)

      //Add first message
      await dispatch('sendMessage', {
        chatId: docRef.id,
        content: `${displayName} created chat room!`
      }) 
      //console.log(docRef);
      return docRef.id
    },
    async joinUserToChatRoom({commit, dispatch, getters}, chatId){
      const { id } = getters.getUser
      const docRef = await firebase.firestore().collection('chats').doc(chatId)
      return await docRef.update({
        users: firebase.firestore.FieldValue.arrayUnion(id),
      })
    },
    async tempMessage({commit, dispatch, getters}, {chatId, content, photo = null}){
      const { id } = getters.getUser
      //console.log(chatId, content, photo);

      // Create temp url
      let tempURL
      if(photo) tempURL = URL.createObjectURL(photo)
      else tempURL = null
      const tempData = {
        userId: id,
        content,
        photoURL: tempURL,
        createdAt: Date.now()
      }

      tempMsg = true
      commit('setNewMessage', [tempData])
      // Send messages
      const url = photo ? await dispatch('uploadRoomPhoto', {
        path: 'messagesPhoto',
        photo
      }) : null
      const messageData = {
        chatId,
        content,
        photoURL: url
      }
      await dispatch('sendMessage', messageData)
      // Delete temp photo url
      URL.revokeObjectURL(tempURL)
    },
    // Send messages to chat (chatId)
    async sendMessage({commit, getters}, {chatId, content, photoURL = null}){
      const { id } = getters.getUser
      const data = {
        userId: id,
        content,
        photoURL,
        createdAt: Date.now()
      }
      const docRef = await firebase.firestore().collection('chats').doc(chatId)
      await docRef.collection('messages').add(data)
    },

  //===== Get actions ===== //
    // Get Shapshot message
    async getShapshotMessage({commit, dispatch}, chatId){
      //console.log("initMessagesArea", initMessagesArea);
      const chatRef = await firebase.firestore().collection('chats').doc(chatId)
      const messages = await chatRef.collection('messages')
      unsubscribe = messages.onSnapshot(snapshot => {
        //console.log(snapshot); 
        if (initMessagesArea) return initMessagesArea = false
        if (tempMsg) return tempMsg = false
        const newMessage = snapshot.docChanges().map(({doc}) => ({...doc.data(), id: doc.id}))
        //console.log(newMessage);
        commit('setNewMessage', newMessage)
      })
    },


    // Get Last Msg by id
    async getLastMsgById({dispatch}, chatId){
      //console.log(chatId); 
      const chatRef = await firebase.firestore().collection('chats').doc(chatId)
      const msg = await chatRef.collection('messages').orderBy('createdAt','desc').limit(1).get()
      const msgConstruct = await dispatch('constructCollection', msg)
      return msgConstruct[0]
    },
    // Get Limited Message
    async getChatRoomMessagesById({commit, dispatch}, chatId){
      if(!lastMessages) return
      //console.log("lastMessages", lastMessages);
      const chatRef = await firebase.firestore().collection('chats').doc(chatId)
      const messages = await chatRef
        .collection('messages')
        .orderBy('createdAt', 'desc')
        .startAfter(lastMessages)
        .limit(8)
        .get()
      lastMessages = messages.docs[messages.docs.length-1]
      const messagesCollection = await dispatch('constructCollection', messages)
      commit('setMessagesArea', messagesCollection.reverse())
    },
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
    prevTypeRooms: state => state.prevTypeRooms,
    // ===
    getMessagesArea: state => state.messagesArea
  }
}
