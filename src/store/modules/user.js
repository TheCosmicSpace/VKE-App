import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/storage'  

import User from "./user_helper"
import secretKey from '@/assets/secretKey.js'

// import { register } from "register-service-worker"
export default {
  state: {
    user: null
  },
  mutations: {
    setUser: (state, payload) => state.user = payload
  },

  actions: {
    // Register query 
    // 0) Create user (auto stateChanged) -> 
    // 1) Update profile (call stateChanged) -> 
    // 2) Save user to collection 
    async registerUser({commit, dispatch}, {username, email, password}){
      await firebase.auth().createUserWithEmailAndPassword(email, password) // 0)
      await dispatch("updateProfile", {displayName: username}) // 1) 
      await dispatch("saveUserToCollection") // 2)
    },
    // Login query
    // Logged user (auto stateChanged)
    async loginUser({commit}, {email, password}){
      await firebase.auth().signInWithEmailAndPassword(email, password)
    },
    // Logout query
    // Logout user (auto stateChanged)
    async logoutUser({commit}){
      await firebase.auth().signOut()
    },
    //Upload File
    async uploadFile({commit, getters}, file){
      const userId = getters.getUser.id
      // Save file to folder usersAvatars with name current user.id 
      const storageRef = await firebase.storage().ref(`usersAvatars/${userId}`).put(file)
      console.log(storageRef);
      // Return Download URL 
      return storageRef.ref.getDownloadURL()
    },
    // Update Profile
    async updateProfile({commit, dispatch}, editData){
      console.log("editData", editData)
      const user = await firebase.auth().currentUser
      await user.updateProfile({...editData})
      await dispatch("stateChanged", user)
    },
    async upgradeToAdmin({getters, dispatch}, key){
      if(secretKey !== key) return false
      const userId = getters.getUser.id
      console.log("userId", userId);
      await firebase.firestore().collection('users').doc(userId).update({
        admin: true
      })
      const user = await dispatch("getUserFromCollection", userId)
      console.log(user);
      await dispatch("stateChanged", user)
    },
    // Save User To Collection
    async saveUserToCollection({commit, getters}){
      const user = getters.getUser
      console.log("user", user);
      await firebase.firestore().collection('users').doc(user.id).set({...user})
    },
    // Save Changes User To Collection
    async saveChangesToCollection({commit, getters}, updateData){
      const userId = getters.getUser.id
      await firebase.firestore().collection('users').doc(userId).update({...updateData})
    },
    async getUserFromCollection({getters}, userId){
      const user = await firebase.firestore().collection('users').doc(userId).get()
      console.log(user.exists);
      return user.exists ? await user.data() : {}
      // return await (await firebase.firestore().collection('users').doc(userId).get()).data()
    },
    //=== StateChanged ===
    async stateChanged({commit, dispatch}, user){
      if (user) {
        const userFromCollection = await dispatch("getUserFromCollection", (user.uid || user.id))
        console.log({...user, ...userFromCollection});
        commit("setUser", new User({...userFromCollection, ...user}))
      }
      else commit("setUser", null)
    }
  },
  getters: {
   getUser: state => state.user,
   checkUser: state => !!state.user,
   checkByAdmin: state => {
     if(!state.user) return false
     return state.user.admin
   }
  }
}
// Save session

// // Updates the user attributes:
// user.updateProfile({
//   displayName: "Jane Q. User",
//   photoURL: "https://example.com/jane-q-user/profile.jpg"
// }).then(function() {
//   // Profile updated successfully!
//   // "Jane Q. User"
//   var displayName = user.displayName
//   // "https://example.com/jane-q-user/profile.jpg"
//   var photoURL = user.photoURL
// }, function(error) {
//   // An error happened.
// })

// // Passing a null value will delete the current attribute's value, but not
// // passing a property won't change the current attribute's value:
// // Let's say we're using the same user than before, after the update.
// user.updateProfile({photoURL: null}).then(function() {
//   // Profile updated successfully!
//   // "Jane Q. User", hasn't changed.
//   var displayName = user.displayName
//   // Now, this is null.
//   var photoURL = user.photoURL
// }, function(error) {
//   // An error happened.
// })