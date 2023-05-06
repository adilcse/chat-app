import { Stack } from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Chat from "../components/Chat";
import ChatHeader from "../components/ChatHeader";
import InputMessageRow from "../components/InputMessageRow";
import {
  addFirebaseMessageV2,
  getUserById,
  listenMsgChangeV2,
  setMessageAsSeen,
} from "../firestoreHelper";
import {
  decodeAndGetMessage,
  encryptMsg,
  getCombinedUUID,
  getEncryptionKey,
} from "../util";
import { updateUsersListAction } from "../redux/action/Action";

export const UserChat = () => {
  const [combinedUUID, setcombinedUUID] = useState("");
  const [encKey, setEncKey] = useState("");
  const [messages, setMessages] = useState([]);
  const { user: me, userList } = useSelector((state) => state.AppReducer);
  const dispatch = useDispatch();
  const param = useParams();
  const user = useMemo(
    () => {
      const u = userList.find((u) => u.id === param?.uid);
      if (!u) {
        getUserById(param?.uid).then(newUser => {
          dispatch(updateUsersListAction([newUser, ...userList]))
        })
      }
      return u;
    },
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
            const myMsg = await decodeAndGetMessage(obj, change.doc.id, userList, encKey);
            updateHeight();
            setMessages((old) => {
              const newMSgs = [...old, myMsg].sort((a,b) => a.createdAt - b.createdAt);
              return newMSgs;
            });
          }
          if (change.type === "modified") {
            const myMsg = await decodeAndGetMessage(change.doc.data(), change.doc.id, userList, encKey);
            setMessages((old) => {
              const newMSgs = old.map(item => {
                if (item.id === myMsg.id) {
                  return myMsg;
                }
                return item;
              });
              return newMSgs;
            });
          }
          if (change.type === "removed") {
            // console.log("Removed city: ", change.doc.data());
          }
        });
      });
    }
  }, [encKey, combinedUUID]);

  useEffect(()=> {
    messages.forEach(msg => {
      if (msg?.sender?.id !== me?.id) {
        if (!msg.seen) {
          setMessageAsSeen(msg);
        }
      }
    })
  }, [messages]);

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
              seen={!!msg.seen}
            />
          );
        })}
      </Stack>
      <InputMessageRow sendMessage={sendMessage} scroll={updateHeight}  />
    </Stack>
  );
};
