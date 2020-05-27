import firebase from 'firebase/app'
import 'firebase/auth'

export default function({next}){
  firebase.auth().onAuthStateChanged(user => {
    if(user) {
      next();
      return true
    }
    else{
      next({ name: 'Auth' })
      return false
    }
  })
}

