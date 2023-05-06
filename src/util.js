import CryptoJS  from "crypto-js";
import { getUser } from "./firestoreHelper";
export const digest = async (message, algorithm = "SHA-256") =>
  Array.prototype.map
    .call(
      new Uint8Array(
        await crypto.subtle.digest(algorithm, new TextEncoder().encode(message))
      ),
      (x) => ("0" + x.toString(16)).slice(-2)
    )
    .join("");

    export const getCombinedUUID = (sender, reciver) => {
        return digest([sender.id, reciver.id].sort().join("-"));
    }
export const getKey = (sender, reciver) => {
    return [sender, reciver].sort((a, b) => {
        if ( a.id < b.id ){
            return -1;
          }
          if ( a.id > b.id ){
            return 1;
          }
          return 0;
    }).reduce((key, user) =>  {
        return key + (user?.id || "") + (user?.email || "")
    }, "")
}

export const getEncryptionKey = (sender,reciver) => {
    const key = getKey(sender,reciver);
    return digest(key)
}

export const encryptMsg = async (plainText, key) => {
    return CryptoJS.AES.encrypt(plainText, key).toString();
}

export const decryptMsg = (ciphertext, key) => {
    return CryptoJS.AES.decrypt(ciphertext, key).toString(CryptoJS.enc.Utf8);
}

function checkNotificationPromise() {
  try {
    Notification.requestPermission().then();
  } catch (e) {
    return false;
  }

  return true;
}
function handlePermission() {
  // set the button to shown or hidden, depending on what the user answers
    if (Notification.permission === 'granted') {
      return true;
    } else {
      return false;
    };
}

export const getNotificationPermission = async () => {
  if (!('Notification' in window)) {
    console.log("This browser does not support notifications.");
  } else if (checkNotificationPromise()) {
    await Notification.requestPermission();
      return handlePermission();
  } else {
    return handlePermission();
}
}

export const showNotification = (title, image, msg, id) => {
    navigator.serviceWorker.ready.then((registration) => {
    console.log("notifying: ", msg);
      registration.showNotification(title, {
        body: msg,
        icon: image,
        vibrate: [200, 100, 200, 100, 200, 100, 200],
        tag: id,
      });
    });
}

export const sleep = (delay = 0) => {
  return new Promise((resolve) => {
    setTimeout(resolve, delay);
  });
};


export const decodeAndGetMessage = async(obj, id, userList, encKey) => {
  const senderId = obj.sender.id;
  const reciverId = obj.reciver.id;
  const sender = await getUser(senderId, userList);
  const reciver = await getUser(reciverId, userList);
  const message = decryptMsg(obj.message, encKey);
  return {
    ...obj,
    id,
    sender,
    reciver,
    message,
    createdAt: obj?.createdAt || new Date(),
  };
}