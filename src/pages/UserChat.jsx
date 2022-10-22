import { Stack } from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Chat from "../components/Chat";
import ChatHeader from "../components/ChatHeader";
import InputMessageRow from "../components/InputMessageRow";
import {
  addFirebaseMessage,
  addFirebaseMessageV2,
  getUser,
  listenMsgChange,
  listenMsgChangeV2,
} from "../firestoreHelper";
import {
  decryptMsg,
  encryptMsg,
  getCombinedUUID,
  getEncryptionKey,
} from "../util";

export const UserChat = () => {
  const [combinedUUID, setcombinedUUID] = useState("");
  const [encKey, setEncKey] = useState("");
  const [messages, setMessages] = useState([]);
  const { user: me, userList } = useSelector((state) => state.AppReducer);
  const param = useParams();
  const user = useMemo(
    () => userList.find((u) => u.id === param?.uid),
    [userList, param?.uid]
  );

  useEffect(() => {
    if (user?.id && me?.id) {
      getCombinedUUID(me, user).then((id) => {
        setcombinedUUID(id);
      });
      getEncryptionKey(me, user).then((id) => {
        setEncKey(id);
      });
    }
  }, [user, me]);

  useEffect(() => {
    if (encKey) {
      setMessages([]);
      let linsterFunc = listenMsgChangeV2;

      return linsterFunc(combinedUUID, (snapshot) => {
        snapshot.docChanges().forEach(async (change) => {
          if (change.type === "added") {
            const obj = change.doc.data();
            const senderId = obj.sender.id;
            const reciverId = obj.reciver.id;
            const sender = await getUser(senderId, userList);
            const reciver = await getUser(reciverId, userList);
            const message = decryptMsg(obj.message, encKey);
            const myMsg = {
              id: change.doc.id,
              sender,
              reciver,
              message,
              createdAt: obj?.createdAt || new Date(),
            };
            updateHeight();
            setMessages((old) => {
              const newMSgs = [...old, myMsg];
              return newMSgs;
            });
          }
          if (change.type === "modified") {
            // console.log("Modified city: ", change.doc.data().reciver);
          }
          if (change.type === "removed") {
            // console.log("Removed city: ", change.doc.data());
          }
        });
      });
    }
  }, [encKey, combinedUUID]);
  const updateHeight = () => {
    setTimeout(() => {
      const el = document.getElementById("chat");
      if (el) {
        el.scrollTop = el.scrollHeight;
      }
    }, 100);
  };
  const sendMessage = (msg) => {
    if (combinedUUID) {
      encryptMsg(msg, encKey).then((encMsg) => {
        // addFirebaseMessage(encMsg, combinedUUID, me, user);
        addFirebaseMessageV2(encMsg, me, user, combinedUUID);
      });
    } else {
      alert("Missing enc ID");
    }
  };
  // console.log(messages);

  return (
    <Stack sx={{ width: "100%", height: "100%", mt: 1 }}>
      <ChatHeader user={user} />
      <Stack
        id="chat"
        sx={{
          width: "100%",
          height: "100%",
          overflowY: "auto",
          alignItems: "center",
        }}
      >
        {messages.map((msg) => {
          return (
            <Chat
              key={msg.id}
              isMe={msg?.sender?.id === me?.id}
              timestamp={msg?.createdAt || new Date()}
              message={msg.message || ""}
            />
          );
        })}
      </Stack>
      <InputMessageRow sendMessage={sendMessage} scroll={updateHeight}  />
    </Stack>
  );
};
