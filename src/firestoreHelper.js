import { async } from "@firebase/util";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { db } from "./firebase";
import { digest } from "./util";

const USER_COLLECTION = "users";
const CHAT_COLLECTION = "chats";

export const addUserToFirestore = async (user) => {
  try {
    const docRef = doc(db, USER_COLLECTION, user.uid);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      await setDoc(doc(db, USER_COLLECTION, user.uid), {
        name: user.displayName,
        email: user.email,
        id: user.uid,
        image: user.photoURL,
        createdAt: serverTimestamp(),
      });
    }
  } catch (error) {
    console.log(error.message);
  }
};

export const getUsersList = async () => {
  try {
    const userRef = collection(db, USER_COLLECTION);
    const myQuery = query(userRef, orderBy("name", "asc"));
    const querySnapshot = await getDocs(myQuery);

    const users = [];
    querySnapshot.forEach((doc) => {
      if (doc.exists()) {
        users.push(doc.data());
      }
    });
    return users;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const getUserById = async (id) => {
  try {
    const userRef = doc(db, USER_COLLECTION, id);
    const docSnapshot = await getDoc(userRef);
      if (docSnapshot.exists()) {
        return doc.data();
      }
    return null
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const getUser = async(id, userList=[]) => {
  const sender =  userList.find(u => u.id === id);
  if (!sender) {
    const u = await getUserById(id);
    return u;
  } else {
    return sender;
  }
}

export const listenMsgChange = (id, onChange) => {
  try {
    const chatRef = collection(db, CHAT_COLLECTION, id, "chats" );
    const myQuery = query(chatRef, orderBy("createdAt", "asc"));
    return onSnapshot(myQuery, onChange);

  } catch (error) {
    console.error(error);
    return;
  }
};

export const addFirebaseMessage = async(msg, combinedUID, sender, reciver) => {
  try {
    await addDoc(collection(db, CHAT_COLLECTION, combinedUID, CHAT_COLLECTION),  {
      message: msg,
      sender: doc(db, USER_COLLECTION, sender.id),
      reciver: doc(db, USER_COLLECTION, reciver.id),
      createdAt: serverTimestamp(),
    });
    return {success: true}
  } catch (error) {
    console.error(error)
    return {success: false}
  }
}