import { getAuth, signOut } from "firebase/auth";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore";
import { db } from "./firebase";

const USER_COLLECTION = "users";
const CHAT_COLLECTION = "chats";
const CHAT_COLLECTION_V2 = "messages";
const MESSAGE_SECRET = "secretId"
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
    } else {
      console.log("user logged in: ", user)
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
        return docSnapshot.data();
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
  }
  return sender;
}

export const listenMsgChange = (id, onChange) => {
  try {
    const chatRef = collection(db, CHAT_COLLECTION, id, "chats" );
    const myQuery = query(chatRef, orderBy("createdAt", "asc"), limit(50));
    return onSnapshot(myQuery, onChange);

  } catch (error) {
    console.error(error);
    return;
  }
};
export const listenMsgChangeV2 = (id, onChange) => {
  try {
    const chatRef = collection(db, CHAT_COLLECTION_V2);
    const myQuery = query(chatRef, where(MESSAGE_SECRET, "==", id), orderBy("createdAt"));
    const us = onSnapshot(myQuery, onChange,  e => {
      console.error(e)
    });
    return us;
  } catch (error) {
    console.error(error);
    return;
  }
};

export const listenForNewMessagesV2 = (uid, onChange) => {
  try {
    const chatRef = collection(db, CHAT_COLLECTION_V2);
    const myQuery = query(chatRef, where("reciverId", "==", uid), orderBy("createdAt", "desc"), limit(10));
    const us = onSnapshot(myQuery, onChange,  e => {
      console.error(e)
    });
    return us;
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

export const addFirebaseMessageV2 = async(msg, sender, reciver, id) => {
  try {
    await addDoc(collection(db, CHAT_COLLECTION_V2),  {
      [MESSAGE_SECRET]: id,
      message: msg,
      sender,
      reciver,
      senderId: sender.id,
      reciverId: reciver.id,
      createdAt: Date.now(),
    });
    return {success: true}
  } catch (error) {
    console.error(error)
    return {success: false}
  }
}

export const logmeout = () => {
  console.log("Logging out");
  const auth = getAuth();
  signOut(auth).then(() => {
    console.log("logout success");
    // Sign-out successful.
  }).catch((error) => {
    // An error happened.
  });
}