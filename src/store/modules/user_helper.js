export default class {
  constructor({uid, id, email, displayName, photoURL, admin, metadata}){
    this.displayName = displayName
    this.email = email
    this.photoURL = photoURL
    this.id = uid || id
    this.admin = admin || false
    // this.metadata = metadata
  }
}