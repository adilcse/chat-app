import { CircularProgress, Stack } from '@mui/material';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import {
    Switch,
    Route,
  } from "react-router-dom";
import App from './App'
import { RequireAuth } from './components/RequireAuth';
import { addUserToFirestore, getUsersList } from './firestoreHelper';
import Login from './pages/Login'
import { UserChat } from './pages/UserChat';
import UsersList from './pages/UsersList';
import { LoginAction, LoginOutAction, updateUsersListAction } from './redux/action/Action';

const Routes = () => {
  const dispatch = useDispatch();
    const {isLoggedIn} = useSelector(state => state.AppReducer);
    const [isLoading, setIsLoading] = useState(true);
    useEffect(()=> {
      console.log("mounting")
      const auth = getAuth();
        return onAuthStateChanged(auth, (user) => {
          if (user && !isLoggedIn) {
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
    
      useEffect(()=> {
        const id = setTimeout(()=> {
            setIsLoading(false);
       }, 2000);
       return () => clearTimeout(id)
      }, []);
      useEffect(() => {
        if (isLoggedIn) {
          getUsersList().then((u) => {
            dispatch(updateUsersListAction(u))
          });
        }
      }, [isLoggedIn]);
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