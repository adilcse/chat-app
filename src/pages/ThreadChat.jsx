import { Alert, Snackbar, Stack } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Chat from "../components/Chat";
import ChatHeader from "../components/ChatHeader";
import InputMessageRow from "../components/InputMessageRow";
import {
  addFirebaseThreadMessage,
  getThreadById,
  listenThreadMsgChange,
  setThreadMessageAsSeen,
} from "../firestoreHelper";
import {
  decodeAndGetThreadMessage,
  digest,
  encryptMsg,
} from "../util";

export const ThreadChat = () => {
  const [encKey, setEncKey] = useState("");
  const [enabled, setEnabled] = useState(false);
  const [thread, setThread] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const [messages, setMessages] = useState([]);
  const { user: me, nearbyThreads, userList } = useSelector((state) => state.AppReducer);
  const param = useParams();
  useEffect(
    () => {
      const u = nearbyThreads.find((u) => u.docId === param?.uid);
      if (!u) {
        getThreadById(param?.uid).then(t => {
          t ? setThread(t) :  setSnackbar({ ...snackbar, severity: 'error', open: true, message: `Thread not found`});
        });
        setSnackbar({ ...snackbar, severity: 'error', open: true, message: `You are not in the zone to send message`});
        setEnabled(false);
      } else {
      setEnabled(true);
      setThread(u);
      }
    },
    [nearbyThreads, param?.uid]
  );

  useEffect(() => {
    thread?.secretId && digest(thread?.secretId).then((id) => {
      setEncKey(id);
    })
  }, [thread]);

  useEffect(() => {
    if (encKey && thread?.id) {
      setMessages([]);
      let linsterFunc = listenThreadMsgChange;

      const unsubscribe = linsterFunc(thread.id, (snapshot) => {
        snapshot.docChanges().forEach(async (change) => {
          if (change.type === "added") {
            const obj = change.doc.data();
            const myMsg = await decodeAndGetThreadMessage(obj, change.doc.id, userList, encKey);
            updateHeight();
            setMessages((old) => {
              const newMSgs = [...old, myMsg].sort((a,b) => a.createdAt - b.createdAt);
              return newMSgs;
            });
          }
          if (change.type === "modified") {
            const myMsg = await decodeAndGetThreadMessage(change.doc.data(), change.doc.id, userList, encKey);
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
      return unsubscribe;
    }
  }, [encKey, thread, userList]);

  useEffect(()=> {
    messages.forEach(msg => {
      if (msg?.sender?.id !== me?.id) {
        if (!msg.seen) {
          setThreadMessageAsSeen(msg);
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
    if (encKey && enabled) {
      encryptMsg(msg, encKey).then((encMsg) => {
        addFirebaseThreadMessage(encMsg, me, thread);
      });
    } else {
      alert("Missing enc ID");
    }
  };
  // console.log(messages);

  return (
    <Stack sx={{ width: "100%", height: "100%", mt: 1 }}>
              <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal:'right' }}
        open={snackbar.open}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        autoHideDuration={5000}
      >
        <Alert
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            severity={snackbar.severity}
            variant="filled"
            sx={{ width: '100%' }}
        >
            {snackbar.message}
        </Alert>
      </Snackbar>
      <ChatHeader user={thread} />
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
      <InputMessageRow disabled={!enabled} sendMessage={sendMessage} scroll={updateHeight}  />
    </Stack>
  );
};
