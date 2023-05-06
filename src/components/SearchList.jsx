import { Stack } from '@mui/material'
import React from 'react'
import UserRow from './UserRow';

const SearchList = ({ user: me, userList, onAddClick, onMessage }) => {
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
                  <UserRow key={user.id} user={{...user, alreadyExist: !!me?.contacts?.includes(user.id)}} onAdd={onAddClick} onMessage={onMessage}/>
              );
            })}
    </Stack>
  )
}

export default SearchList