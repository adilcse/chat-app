import { Typography } from '@mui/material';
import { Stack } from '@mui/system';
import { getDatabase, onChildAdded, ref } from 'firebase/database';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';

const UsersList = () => {
    const [users, setUsers] = useState([]);
    const {isLoggedIn} = useSelector(state => state.AppReducer);

    useEffect(()=>{
        let resp = () => {};
        if (isLoggedIn) {
            const db = getDatabase();
            const dbRef =  ref(db, 'users');
          resp = onChildAdded(dbRef, (data) => {
            setUsers(old=>[...old,data.val()])
        }
        );
      }
      return resp
      },[isLoggedIn]);
  return (
    <Stack>
        {users.map((user) => {
            return (<Stack key={user.id}>
                <Typography>{user.name}</Typography>
            </Stack>)
        })}
    </Stack>
  )
}

export default UsersList