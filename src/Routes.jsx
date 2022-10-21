import { CircularProgress } from '@mui/material';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import {
    Switch,
    Route,
  } from "react-router-dom";
import App from './App'
import { RequireAuth } from './components/RequireAuth';
import Login from './pages/Login'
import UsersList from './pages/UsersList';
import { LoginAction, LoginOutAction } from './redux/action/Action';

const Routes = () => {
  const auth = getAuth();
  const dispatch = useDispatch();
    const {isLoggedIn} = useSelector(state => state.AppReducer);
    const [isLoading, setIsLoading] = useState(true);
    useEffect(()=> {
        return onAuthStateChanged(auth, (user) => {
          if (user && !isLoggedIn) {
            console.log(user)
            dispatch(LoginAction({
                name: user.displayName,
                email: user.email,
                id: user.uid,
                image: user.photoURL,
            }));
          } else if (!user){
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
    if (isLoading) {
        return <CircularProgress />
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
        <Route exact path="/">
        <RequireAuth>
            <App/>
        </RequireAuth>
        </Route>
    </Switch>
  )
}

export default Routes