import firebase from "firebase/app";
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';

let firebaseConfig = {
    apiKey: "AIzaSyCKf9jny2UiZdILZNfRY8H1ACTh4c7bKoM",
    authDomain: "sistema-1526c.firebaseapp.com",
    projectId: "sistema-1526c",
    storageBucket: "sistema-1526c.appspot.com",
    messagingSenderId: "159133746155",
    appId: "1:159133746155:web:89d6a8b797d4830060cfae",
    measurementId: "G-56DLLDFG4Z"
  };
  
  // Initialize Firebase
  if(!firebase.apps.length){
    firebase.initializeApp(firebaseConfig);
  }

  export default firebase;