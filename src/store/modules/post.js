import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/storage'  
import 'firebase/database'

let lastVisible = {}, initialReq = true
function UUID(){
  return (Date.now() + Math.floor(Math.random() * 100)).toString()
}

export default {
  state: {
    postsCollection: [],
    isEmptyResponse: false,
    lastSize: 0,
    limit: 5
    // lastVisible: {},
  },
  mutations: {
    setPostsCollection: (state, postsCollection) => {
      state.postsCollection.push(...postsCollection)
      console.log(state.postsCollection)
    },
    addNewPost: (state, newPost) => state.postsCollection.unshift(...newPost),
    setLastSize: (state, value) => state.lastSize = value,
    setIsEmptyResponse: (state, value) => state.isEmptyResponse = value,
    toggleLike: (state, {currPost, userId, likeAction}) => {
      if(likeAction) currPost.likedUsers.push(userId)
      else currPost.likedUsers = currPost.likedUsers.filter(uid => uid !== userId)
    }
    // setLastVisible: (state, value) => state.lastVisible = Object.assign(value), 
  },
  actions: {
  // Set Data Actions ===
    //Upload File
    async uploadPostPhoto({commit}, photo){
      const storageRef = await firebase.storage().ref(`postsPhoto/${UUID()}`).put(photo)
      return storageRef.ref.getDownloadURL()
    },
    // Get Default Photo Url
    async defaultPostPhoto(){
      const storageRef = await firebase.storage().ref(`postsPhoto/postImgDefault.jpg`)
      return storageRef.getDownloadURL()
    },
    // Send Post
    async sendPost({commit, dispatch, getters}, {postTitle, postText, postPhoto}){
      // Get userId for to set author post
      const userId = getters.getUser.id
      //Get url post's photo
      const postPhotoURL = postPhoto ? await dispatch("uploadPostPhoto", postPhoto) : await dispatch("defaultPostPhoto")
      console.log(postPhotoURL)
      // Create Post Unit Obj
      const postData = {
        postTitle,
        postText,
        postPhotoURL,
        userId,
        likedUsers: []
      }
      // Get current time from server
        postData.createAt = new Date().getTime()
        // const offsetRef = await firebase.database().ref(".info/serverTimeOffset");
        // offsetRef.on("value", function(snap) {
        //   postData.createAt = new Date().getTime() + snap.val()
        // });
      // Save post to db
      const postRes = await firebase.firestore().collection('posts').add({...postData})
      console.log(postRes)
    },
    // Like Post
    async toLikePost({commit, getters}, {postId, userId, likeAction}){
      if(likeAction) await firebase.firestore().collection('posts').doc(postId)
        .update({likedUsers: firebase.firestore.FieldValue.arrayUnion(userId)})
      else await firebase.firestore().collection('posts').doc(postId)
        .update({likedUsers: firebase.firestore.FieldValue.arrayRemove(userId)})

      const currPost = getters.getSomePost(postId)
      commit('toggleLike', {currPost, userId, likeAction})   
    },
  // Get Data Actions ===  
    async addEventOnSnapshot({commit, dispatch, getters}){
      await firebase.firestore().collection('posts').onSnapshot(snapshot => {
        console.log(snapshot);
        console.log(getters.getPostsCollection);
        if(initialReq || snapshot.size === getters.getPostsCollection.length) return initialReq = false
        console.log("snapshot", snapshot.docChanges());
        const snapshotNew = snapshot.docChanges().map(({doc}) => ({...doc.data(), id: doc.id}))
        console.log("snapshotChanges", snapshotNew);
        dispatch("addAuthorPost", snapshotNew)
        .then(modifiedDoc => commit("addNewPost", modifiedDoc))
      })
    },
    async callPostsCollection({commit, dispatch, getters}){
      const snapshot = await firebase.firestore()
        .collection('posts')
        .orderBy("createAt", "desc")
        .startAfter(lastVisible)
        .limit(getters.getLimit)
        .get()
        commit("setLastSize", snapshot.size)
        if(snapshot.empty) return commit("setIsEmptyResponse", snapshot.empty)

        console.log(snapshot);
        lastVisible = snapshot.docs[snapshot.docs.length-1]
        const snapshotCollection = snapshot.docs.map(doc => ({...doc.data(), id: doc.id}))
        const modifiedCollection = await dispatch("addAuthorPost", snapshotCollection)
        console.log("modifiedCollection", modifiedCollection);
        commit("setPostsCollection", modifiedCollection)
      },
      async addAuthorPost({commit}, snapshotCollection){
      let postsCollection = [];
      for(const snapshot of [...snapshotCollection]){
        const author = await firebase.firestore().collection('users').doc(snapshot.userId).get()
        postsCollection.push({...snapshot, author: author.data()})
      }
      return postsCollection
    }
  },
  getters: {
    getLimit: state => state.limit,
    getPostsCollection: state => state.postsCollection,
    getLastSize: state => state.lastSize,
    getIsEmptyResponse: state => state.isEmptyResponse,
    getSomePost: (state) => postId => state.postsCollection.find(({id}) => id === postId)
    // getLastVisible: state => state.lastVisible,
  }
}
