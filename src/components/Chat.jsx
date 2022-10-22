import { Stack, Typography } from '@mui/material'
import moment from 'moment/moment'
import React from 'react'

const Chat = ({isMe, message, timestamp}) => {
  return (
    <Stack direction="row" sx={{width: "90%", my:1, justifyContent: isMe ? "flex-end": "flex-start", 
}}>
        <Stack sx={{
    alignSelf: isMe ? "left": "right", px: 2, maxWidth:"80%", minWidth: "30%", background: isMe? "tomato" :"#606470", borderRadius: 4}}>
        <Typography sx={{color: "white", mt:1, wordBreak: "break-all" }}>
            {message}
        </Typography>
        <Typography sx={{color: "white", fontSize: 10, ml: 'auto', overflow: "auto", }}>
            {moment(timestamp).format("hh:mm a")}
        </Typography>
        </Stack>

    </Stack>
  )
}

export default Chat