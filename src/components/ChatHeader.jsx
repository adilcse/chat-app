import { Avatar, Button, Stack, Typography } from '@mui/material'
import React from 'react'
import { Link } from 'react-router-dom'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
const ChatHeader = ({user}) => {
    if (!user) {
      return <></>
    }
  return (
    <Stack direction="row" >
      <Link to="/" style={{margin: "auto 5px"}}>
        <Button sx={{alignSelf: "center", my: "auto"}}>
        <ArrowBackIcon/>
        </Button>
      </Link>
    {user.image ? (
            <img
              style={{ borderRadius: "50%" }}
              src={user.image}
              alt={user.name}
              width={50}
              height={50}
            />
          ) : (
            <Avatar sx={{width: 50, height: 50, borderRadius: "50%"}} />
          )}
          <Typography variant='h5' sx={{ml: 2, alignSelf: "center", textTransform:"capitalize"}}>
            {user.name}
          </Typography>
</Stack>
  )
}

export default ChatHeader