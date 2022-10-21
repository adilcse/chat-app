import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Replace the following with your app's Firebase project configuration
// See: https://firebase.google.com/docs/web/learn-more#config-object
const firebaseConfig = {
    apiKey: "AIzaSyCvupajRh0j_63qQUUyBJmcnlEayKT3cCM",
    authDomain: "chat-app-6e0e6.firebaseapp.com",
    projectId: "chat-app-6e0e6",
    storageBucket: "chat-app-6e0e6.appspot.com",
    messagingSenderId: "33904656688",
    appId: "1:33904656688:web:5fb69393e88773aec9c8f5"
  };
  const app = initializeApp(firebaseConfig);


  // Initialize Cloud Firestore and get a reference to the service
  export const db = getFirestore(app);
  export const auth = getAuth(app);

