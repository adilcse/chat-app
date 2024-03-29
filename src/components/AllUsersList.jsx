import {  Stack } from '@mui/material'
import React from 'react'
import { Link } from 'react-router-dom';
import UserRow from './UserRow';

const AllUsersList = ({userList}) => {
  return (
    <Stack
    direction="column"
    sx={{
      width: "100%",
      mx: "auto",
      borderRadius: "5px",
      height: "100%",
      justifyContent: "center",
      maxWidth: "500px",
    }}
  >
    {userList
            .map((user) => {
              return (
                <Link key={user.id} to={"/chat/"+user.id}>
                  <UserRow user={user}/>
                </Link>
              );
            })}
    </Stack>
  )
}

export default AllUsersList