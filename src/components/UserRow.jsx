import { Add, Message, Remove } from '@mui/icons-material';
import { Avatar, IconButton, Stack, Typography } from '@mui/material'
import React from 'react'

function UserRow({user, onAdd, onMessage}) {
    if (!user) {
        return null;
    }
  return (
    <Stack
    sx={{
      width: "100%",
      height: "80px",
      alignItems: "center",
      borderBottom: "1px solid grey",
      px: 2,
    }}
    direction="row"
    key={user.id}
  >
    {user.image ? (
      <img
        style={{ borderRadius: "50%" }}
        src={user.image}
        alt={user.name}
        width={50}
        height={50}
      />
    ) : (
      <Avatar sx={{width: 50, height: 50}} />
    )}
    <Stack sx={{justifyContent: "left"}}>
    <Typography variant="h5" sx={{ ml: 2, alignSelf: "left" }}>
      {user.name}
    </Typography>
    <Typography variant="body2" sx={{ ml: 2, alignSelf: "left", color: "grey"  }}>
      {user.email}
    </Typography>
    </Stack>
    <Stack direction={"row"} sx={{ml: "auto"}}>
    {onMessage && <IconButton  onClick={() => onMessage(user)}><Message /></IconButton> }
    {onAdd && <IconButton sx={{ml: 1}} onClick={() => onAdd(user)}>
        {!user.alreadyExist ? <Add /> : <Remove/>}
        </IconButton> }
    </Stack>
  </Stack>
  )
}

export default UserRow