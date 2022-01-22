


//this block is using the createUserWithEmailAndPassword auth from firebase
import firebase from 'firebase';

//This block is part of my attempt to use google authentication for signin
// import firebase from 'firebase/app';
// import 'firebase/auth'; // for authentication
// import 'firebase/storage'; // for storage
// import 'firebase/database'; //real time database
// import 'firebase/firestore'; // the cloud


// the following two const (firebaseConfig, firebaseApp) for createUserWithEmailAndPassword from firebasee
const firebaseConfig = {
  apiKey: "AIzaSyAP0yhg-NJJ8htFdIL-c7Ckkx22t_IaEA4",
  authDomain: "photo-social-9d90d.firebaseapp.com",
  projectId: "photo-social-9d90d",
  storageBucket: "photo-social-9d90d.appspot.com",
  messagingSenderId: "210100159107",
  appId: "1:210100159107:web:dbf1950443cd6f036111b6"
};

const firebaseApp = firebase.initializeApp(firebaseConfig)
const db = firebaseApp.firestore()
const auth = firebase.auth()
const storage = firebase.storage()

export { db, auth, storage }


//This block is part of my attempt to use google authentication for signin
// const firebaseApp = firebase.initializeApp(firebaseConfig)
// const db = firebaseApp.firestore()
// const auth = firebase.auth()
// const provider = new firebase.auth.GoogleAuthProvider()

// export { auth, provider }
// export default db 




