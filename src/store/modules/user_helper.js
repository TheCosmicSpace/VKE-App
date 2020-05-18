export default class {
  constructor({uid, email, displayName, photoURL, admin, metadata}){
    this.displayName = displayName;
    this.email = email;
    this.photoURL = photoURL;
    this.id = uid;
    this.admin = admin;
    // this.metadata = metadata;
  }
}