import { Button, InputBase, Paper, Stack } from '@mui/material'
import SendIcon from '@mui/icons-material/Send';
import React, { useState } from 'react';


const InputMessageRow = ({sendMessage, scroll, disabled=false}) => {
  const [msg, setMsg] = useState("");
  const sendChat = () => {
    if (msg && msg.trim()) {
      sendMessage(msg);
      setMsg("");
    }
  }
  return (
    <Stack direction="row" sx={{mt: "auto", mb: 3}}> 
        <Paper
          value={msg} onInput={e=>setMsg(e.target.value)}
          sx={{ display: 'flex', alignItems: 'center', width: '80%', mx: 1,
          boxShadow: 'rgba(3, 102, 214, 0.3) 0px 0px 0px 3px',  padding: '17px 15px',
          borderRadius: '12px',cursor: 'pointer',  fontFamily: 'Open Sans, sans-serif', fontSize: 'medium'}}>
              <InputBase
               onInput={(e) => setMsg(e.target.value)}
               onFocus={scroll}
               disabled={disabled}
               onKeyUp={e => {
                if (e.key === "Enter") {
                  sendChat()
                }
               }}
               value={msg}
                sx={{ ml: 2, flex: 1 }}
                placeholder="Say something...."
            />
        </Paper>
      <Button sx={{fonSize: 20, ml: 1}} onClick={sendChat} variant="contained" endIcon={<SendIcon />}> 🕊️</Button>
    </Stack>
  )
}

export default InputMessageRow