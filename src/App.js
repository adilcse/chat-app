import { Button, InputBase, Paper } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import SendIcon from '@mui/icons-material/Send';
import './App.css';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { Stack } from '@mui/system';
import { getDatabase, push, ref, set,onChildAdded } from "firebase/database";
import { GoogleAuthProvider, getAuth, signInWithPopup, onAuthStateChanged } from "firebase/auth";
import { useSelector } from 'react-redux';

// import { db } from './firebase';

// import { collection, addDoc, serverTimestamp, doc } from "firebase/firestore"; 
const chatGroup = "chat1";
const App = () => {



  const provider = new GoogleAuthProvider();
  const auth = getAuth();
  // const [user, setUser] = useState({name: "", email: ""});
  const [chats, setChats] = useState([]);
  const [msg, setMsg] = useState('');
  const {user} = useSelector(state => state.AppReducer);
  // const googleLogin = () =>{
  //   signInWithPopup(auth, provider)
  // .then((result) => {
  //   // This gives you a Google Access Token. You can use it to access the Google API.
  //   const credential = GoogleAuthProvider.credentialFromResult(result);
  //   const token = credential.accessToken;
  //   // The signed-in user info.
  //   const user = result.user;
  //   setUser({name:user.displayName, email: user.email})
  //   console.log(token, user);

  // }).catch((error) => {
  //   // Handle Errors here.
  //   const errorCode = error.code;
  //   const errorMessage = error.message;
  //   // The email of the user's account used.
  //   const email = error.email;
  //   // The AuthCredential type that was used.
  //   const credential = GoogleAuthProvider.credentialFromError(error);
  //   // ...
  // });
  // }

  const db = getDatabase();
  const chatListRef = ref(db, 'chats');



  const updateHeight=()=>{
    const el = document.getElementById('chat');
    if(el){
      el.scrollTop = el.scrollHeight;
    }
  }

  useEffect(()=>{
    let resp = () => {};
    if (user?.email) {
      resp = onChildAdded(chatListRef, (data) => {
        console.log(data.val())
        setChats(chats=>[...chats,data.val()])
        setTimeout(()=>{
          updateHeight()
  
        },100)
    }
    );
  }
  return resp
  },[user]);

  // useEffect(()=> {
  //   onAuthStateChanged(auth, (user) => {
  //     if (user) {
  //       setUser({name:user.displayName, email: user.email})
  //       // User is signed in, see docs for a list of available properties
  //       // https://firebase.google.com/docs/reference/js/firebase.User
  //       const uid = user.uid;
  //       // ...
  //     } else {
  //       // User is signed out
  //       // ...
  //     }
  //   });
  // },[]);

  const sendChat = () => {

    if (msg && msg.trim()) {
      const chatRef = push(chatListRef);
      set(chatRef, {
        user, message: msg 
      });
      setMsg('');
    }
  }
  function SignOut() {
    return auth.currentUser && (
      <button className="sign-out" onClick={() => auth.signOut()}>Sign Out</button>
    )
  }
 
  
  return (
    <Stack>
      <Stack>
        <AppBar position="static">
          <Toolbar variant="dense">
            <Typography variant="h6" color="inherit" component="div">
              Chatu
            </Typography>
            {/* {user.email? null: <div>
        <input
          type="text"
          placeholder="Enter user to start"
          onBlur={(e) => setUser(e.target.value)}
        ></input>
        <Stack sx={{justifyContent: "center", alignItems: "center", mt: 3}} >
        <Button onClick={e=>{googleLogin()}} sx={{width: "max-content"}} variant="contained"  sendIcon={<SendIcon />}> Login</Button>

        </Stack>
      </div>}      */}
          </Toolbar>
        </AppBar>
      </Stack>
 
   { user.email? <div>
      <h3>User: {user.name}</h3>
      <div id="chat" className="chat-container">
        {chats.map((c,i) => (
          <div key={i} className={`container ${c?.user?.email === user.email ? 'me' : ''}`}>
            <p className="chatbox">
              <strong>{c?.user?.name || "Anyonomus"}: </strong>
              <span>{c?.message}</span>
            </p>
          </div>
        ))}
      </div>
      <div className="btm">
        <Paper
          value={msg} onInput={e=>setMsg(e.target.value)}
          sx={{ display: 'flex', alignItems: 'center', width: '100rem',
          boxShadow: 'rgba(3, 102, 214, 0.3) 0px 0px 0px 3px', marginLeft: '3%', padding: '17px 15px',
          borderRadius: '12px',cursor: 'pointer',  fontFamily: 'Open Sans, sans-serif', fontSize: 'medium'}}>
              <InputBase
               onInput={(e) => setMsg(e.target.value)}
               onKeyUp={e => {
                if (e.key == "Enter") {
                  sendChat()
                }
               }}
               value={msg}
                sx={{ ml: 2, flex: 1 }}
                placeholder="Say something...."
            />
        </Paper>
      <Button sx={{fonSize: 20}} onClick={(e) => sendChat()} variant="contained" endIcon={<SendIcon />}> 🕊️</Button>

      </div>
      </div> : null}
      

    </Stack>
    
    
  );
};

export default App;
