import { Google } from '@mui/icons-material'
import { Button, Card, CardContent, Stack, Typography } from '@mui/material'
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { child, get, getDatabase, push, ref, serverTimestamp, set } from 'firebase/database';

import React, { } from 'react'

import { useDispatch, useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { db } from '../firebase';
import { addUserToFirestore } from '../firestoreHelper';
import { LoginAction } from '../redux/action/Action';

const Login = () => {
    const {isLoggedIn} = useSelector(state => state.AppReducer);
  const auth = getAuth();
  const provider = new GoogleAuthProvider();
  const addUserToRTD = (user) => {
    const mydb = getDatabase();
    const dbRef =  ref(mydb, 'users/'+user.uid);
    get(dbRef).then((snapshot) => {
        if (snapshot.exists()) {
          console.log(snapshot.val());
        } else {
          console.log("No data available");
          set(ref(mydb, 'users/' + user.uid), {
            name: user.displayName,
            email: user.email,
            id: user.uid,
            image: user.photoURL,
        });
        }
      }).catch((error) => {
        console.error(error);
      });
  }

    const googleLogin = () =>{
        signInWithPopup(auth, provider)
        .then((result) => {
            const user = result.user;
            // addUserToRTD(user);
            addUserToFirestore(user);
        })
        .catch((error) => {
        const errorMessage = error.message;
        alert(errorMessage)
      });
      }
      if (isLoggedIn) {
        return <Redirect to="/"/>;
      }
  return (
    <Stack sx={{flex: 1, alignItems: 'center', justifyContent: "center", mt: "10%"}}>
        <Card sx={{minWidth: "300px", maxWidth: "500px"}}>
            <CardContent sx={{textAlign: "center"}}>
                <Typography variant='h5' sx={{textAlign: "center", my: 3}}>
                    Login
                </Typography>
                <Button variant='outlined' startIcon={<Google />} onClick={googleLogin}>
                    Click Here</Button>
            </CardContent>
        </Card>
    </Stack>
  )
}

export default Login