import CryptoJS  from "crypto-js";
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