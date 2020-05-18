import firebase from 'firebase/app'
import 'firebase/auth'

export default function({next}){
  firebase.auth().onAuthStateChanged(user => {
    if(user) next();
    else next({ name: 'Auth' })
  })
}