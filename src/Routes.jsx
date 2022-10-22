import { CircularProgress, Stack } from '@mui/material';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import {
    Switch,
    Route,
    useHistory,
  } from "react-router-dom";
import App from './App'
import { RequireAuth } from './components/RequireAuth';
import { addUserToFirestore, getUser, getUsersList, listenForNewMessagesV2 } from './firestoreHelper';
import Login from './pages/Login'
import { UserChat } from './pages/UserChat';
import UsersList from './pages/UsersList';
import { LoginAction, LoginOutAction, updateRecentMessageAction, updateUsersListAction } from './redux/action/Action';
import { decryptMsg, getEncryptionKey } from './util';

const Routes = () => {
  const auth = getAuth();
  const dispatch = useDispatch();
  const history = useHistory();
    const {isLoggedIn, userList, user, recentMessages} = useSelector(state => state.AppReducer);
    const [isLoading, setIsLoading] = useState(true);
    useEffect(()=> {
      const id = setTimeout(()=> {
          setIsLoading(false);
          console.log("loaded");
     }, 3000);
     return () => clearTimeout(id)
    }, []);

    
    useEffect(()=> {
        return onAuthStateChanged(auth, (user) => {
          if (user) {
             addUserToFirestore(user);
            dispatch(LoginAction({
                name: user.displayName,
                email: user.email,
                id: user.uid,
                image: user.photoURL,
            }));
          } else {
            dispatch(LoginOutAction());
          }
        });
      },[]);
    
      useEffect(() => {
        if (isLoggedIn) {
          getUsersList().then((u) => {
            dispatch(updateUsersListAction(u))
          });
        }
      }, [isLoggedIn]);

      useEffect(() => {
        if (isLoggedIn && user) {
          dispatch(updateRecentMessageAction([]));
          return listenForNewMessagesV2( user.id, snapshot => {
            snapshot.docChanges().forEach(async (change) => {
              if (change.type === "added") {
                const obj = change.doc.data();
                const senderId = obj.sender.id;
                const reciverId = obj.reciver.id;
                const sender = await getUser(senderId, userList);
                const reciver = await getUser(reciverId, userList);
                const encKey = await getEncryptionKey(sender, reciver);
                const message = decryptMsg(obj.message, encKey);
                const myMsg = {
                  id: change.doc.id,
                  sender,
                  reciver,
                  message,
                  createdAt: obj?.createdAt || new Date(),
                };
                dispatch(updateRecentMessageAction(myMsg));
              }})
          })
        }
      }, [isLoggedIn, user]);

      useEffect(()=> {
        if (!isLoading &&  recentMessages.length) {
          const lastMessage = recentMessages[0];
          if(window.location.pathname !== '/' && lastMessage?.message && lastMessage.sender?.id && !window.location.pathname.includes(lastMessage.sender?.id)) {
            const myNotify = new Notification('New Message from ' + lastMessage.sender?.name, { body: lastMessage.message?.length>20 ?
              lastMessage.message.substring(0, 20) :lastMessage.message , icon: lastMessage.sender.image }
              );
            myNotify.onclick = (e) => {
              history.push("/chat/"+ lastMessage.sender?.id);
            }
          }
        }
      }, [isLoading, recentMessages])
    if (isLoading) {
        return (
        <Stack sx={{width: "100%", height: "100%", justifyContent: "center", alignItems: "center"}}>
 <CircularProgress />
        </Stack>)
    }
  return (
    <Switch>
        <Route path="/login">
            <Login/>
        </Route>
        <Route path="/users">
            <RequireAuth>
                <UsersList/>
            </RequireAuth>
        </Route>
        <Route path="/chat/:uid">
            <RequireAuth>
                <UserChat/>
            </RequireAuth>
        </Route>
        <Route exact path="/asif">
        <RequireAuth>
            <App/>
        </RequireAuth>
        </Route>
        <Route exact path="/">
        <RequireAuth>
            <UsersList/>
        </RequireAuth>
        </Route>
    </Switch>
  )
}

export default Routes