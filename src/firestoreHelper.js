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
  startAt,
  endAt,
  arrayUnion,
  updateDoc,
  arrayRemove,
  GeoPoint
} from "firebase/firestore";
import { db } from "./firebase";
import { geohashQueryBounds, distanceBetween } from 'geofire-common';
import { v4 as uuid } from 'uuid';
const USER_COLLECTION = "users";
const CHAT_COLLECTION = "chats";
const CHAT_COLLECTION_V2 = "messages";
const THREAD_MESSAGE = "threadMessages";
const THREADS = "threads";
const MESSAGE_SECRET = "secretId";
const THREAD_ID = "threadId";
const DEFAULT_GROUP_RADIUS = 5;

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
        contacts: []
      });
    } else {
      await updateDoc(doc(db, USER_COLLECTION, user.uid), {
        lastLoggedIn: serverTimestamp(),
      });
      console.log("user logged in: ", user)
    }
  } catch (error) {
    console.log(error.message);
  }
};

export const getUsersList = async (user) => {
  try {
    const userRef = collection(db, USER_COLLECTION);
    const myQuery = query(userRef, where("id", "in" , user.contacts), orderBy("name", "asc"));
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

export const searchUsersList = async (field, text = "") => {
  try {
    text = text.toLowerCase();
    const end = text.replace(/.$/, c => String.fromCharCode(c.charCodeAt(0) + 1));
    const userRef = collection(db, USER_COLLECTION);
    const myQuery = query(userRef, where(field, ">=", text), where(field, "<", end),  orderBy(field, "asc"), limit(20));
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

export const getThreadById = async (id) => {
  try {
    const threadRef = doc(db, THREADS, id);
    const docSnapshot = await getDoc(threadRef);
      if (docSnapshot.exists()) {
        const data = docSnapshot.data();
        return{...data, id, docId: id}
      }
    return null
  } catch (error) {
    console.error(error);
    return null;
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

export const listenThreadMsgChange = (id, onChange) => {
  try {
    const chatRef = collection(db, THREAD_MESSAGE);
    const myQuery = query(chatRef, where(THREAD_ID, "==", id), orderBy("createdAt"));
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

export const addFirebaseThreadMessage = async(msg, sender, thread) => {
  console.log({msg, sender, thread})
  try {
    await addDoc(collection(db, THREAD_MESSAGE),  {
      message: msg,
      senderId: sender.id,
      threadId: thread.id,
      createdAt: Date.now(),
    });
    return {success: true}
  } catch (error) {
    console.error(error)
    return {success: false}
  }
}

export const addNewGroup = async(name, description, location, userId) => {
  try {
    const userRef = doc(collection(db, THREADS), userId);
    await addDoc(collection(db, THREADS),  {
      name,
      description,
      geoHash: location.geoHash,
      visibleRadius: DEFAULT_GROUP_RADIUS,
      threadLocation: new GeoPoint(location.latitude, location.longitude),
      secretId: uuid(),
      createdAt: Date.now(),
      createdBy: userRef
    });
    return {success: true}
  } catch (error) {
    console.error(error)
    return {success: false}
  }
}

export const updateFirebaseUserLocation =async(user, location) => {
  const userId = user?.id;
  if (!location?.latitude || !location?.longitude || !userId) {
    return;
  }
  
  const docRef = doc(db, USER_COLLECTION, userId);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
   updateDoc(docRef, {
    geoHash:location.geoHash,
    location: new GeoPoint(location.latitude, location.longitude),
    visibleRadius: DEFAULT_GROUP_RADIUS
   })
  }
};

export const getNearbyThreads = async(user, location, page =1, l =100) => {
  const center = [location.latitude, location.longitude];
  const radiusInM = (user.visibleRadius || DEFAULT_GROUP_RADIUS) * 1000;
  const bounds = geohashQueryBounds(center, radiusInM);
  const promises = [];
for (const b of bounds) {
  const q = query(
    collection(db, THREADS), 
    orderBy('geoHash'), 
    startAt(b[0]), 
    endAt(b[1]),
    limit(l));
  promises.push(getDocs(q));
}
const snapshots = await Promise.all(promises);
const matchingDocs = [];
for (const snap of snapshots) {
  for (const doc of snap.docs) {
    const thread = doc.data();
    thread.docId = doc.id;
    thread.id = doc.id;
    const lat = thread.threadLocation?.latitude;
    const lng = thread.threadLocation?.longitude;

    // We have to filter out a few false positives due to GeoHash
    // accuracy, but most will match
    const distanceInKm = distanceBetween([lat,lng], center);
    const distanceInM = distanceInKm * 1000;
    if (distanceInM <= radiusInM) {
      thread.distance = distanceInM / 1000;
      matchingDocs.push(thread);
    }
  }
};
matchingDocs.sort((a,b) => a.createdAt -b.createdAt);
return matchingDocs;
}

export const addFirebaseUserContact = async(me, userId) => {
  try {
    const docRef = doc(db, USER_COLLECTION, me.id);
    if (me.contacts && me.contacts.includes(userId)) {
      await updateDoc(docRef, {
        contacts: arrayRemove(userId)
      });
      me.contacts = me.contacts.filter(id=> id!==userId);
      return {success: true, data: me}
    }
    if (!me.contacts) {
      await updateDoc(docRef, {
        contacts: [userId]
      });
      me.contacts = [userId]
    } else {
      await updateDoc(docRef, {
        contacts: arrayUnion(userId)
      });
      me.contacts.push(userId)
    }
    return {success: true, data: me}
  } catch (error) {
    console.error(error)
    return {success: false, data: me}
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

export const setMessageAsSeen = async(message) => {
  try {
    await updateDoc(doc(db, CHAT_COLLECTION_V2, message.id),  {
      seen: true
    });
    return {success: true}
  } catch (error) {
    console.error(error)
    return {success: false}
  }
}


export const setThreadMessageAsSeen = async(message) => {
  try {
    await updateDoc(doc(db, THREAD_MESSAGE, message.id),  {
      seen: true
    });
    return {success: true}
  } catch (error) {
    console.error(error)
    return {success: false}
  }
}