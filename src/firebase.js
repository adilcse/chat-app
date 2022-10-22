import { initializeApp } from "firebase/app";
import { CACHE_SIZE_UNLIMITED, enableIndexedDbPersistence, enableMultiTabIndexedDbPersistence, getFirestore, initializeFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Replace the following with your app's Firebase project configuration
// See: https://firebase.google.com/docs/web/learn-more#config-object
const firebaseConfig = {
  apiKey: "AIzaSyCKL9rRH2M-m2fSl_HopuhavFDgQG-VtXY",
  authDomain: "chatwithchat2.firebaseapp.com",
  projectId: "chatwithchat2",
  storageBucket: "chatwithchat2.appspot.com",
  messagingSenderId: "1061072866652",
  appId: "1:1061072866652:web:c4701c53b04700e570c599",
  measurementId: "G-0SJJXWJLH5"
};
  const app = initializeApp(firebaseConfig);

  // Initialize Cloud Firestore and get a reference to the service
  export const db = initializeFirestore(app, {
  cacheSizeBytes: CACHE_SIZE_UNLIMITED
  });
  enableIndexedDbPersistence(db)
  .catch((err) => {
    console.error("error in caching", err);
  });
  export const auth = getAuth(app);

