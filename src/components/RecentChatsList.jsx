import { Avatar, Stack, Typography } from '@mui/material'
import React, { useMemo } from 'react'
import { Link } from 'react-router-dom';

const RecentChatsList = ({recentMessages}) => {
  const msgList = useMemo(() => {
    const userMessage = {};
    recentMessages.forEach(element => {
      if (element?.sender?.id && !userMessage[element.sender.id]) {
        element.count = 1;
        userMessage[element.sender.id] = element;
      } else if (element?.sender?.id && userMessage[element.sender.id]) {
        userMessage[element.sender.id]["count"]= userMessage[element.sender.id]["count"] ? userMessage[element.sender.id]["count"] + 1 : 1
      }
  });
  return Object.values(userMessage).sort((a,b) => b.createdAt - a.createdAt);
}, [recentMessages]);

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
    {msgList
            .map((msg) => {
              return (
                <Link key={msg?.sender?.id || msg.createdAt} to={"/chat/"+msg?.sender?.id}>
                <Stack
                  sx={{
                    width: "100%",
                    height: "80px",
                    alignItems: "center",
                    borderBottom: "1px solid grey",
                    px: 2,
                  }}
                  direction="row"
                >
                  {msg?.sender?.image ? (
                    <img
                      style={{ borderRadius: "50%" }}
                      src={msg?.sender?.image}
                      alt={msg?.sender?.name}
                      width={50}
                      height={50}
                    />
                  ) : (
                    <Avatar sx={{width: 50, height: 50}} />
                  )}
                  <Stack>
                  <Typography variant="h5" sx={{ ml: 2, }}>
                    {msg?.sender?.name}
                  </Typography>
                  <Typography variant="body1" sx={{ ml: 2, alignSelf: "left",  whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis', }}>
                    {msg?.message}
                  </Typography>
                  </Stack>
                  <Stack sx={{ml: "auto"}}>
                    <Typography sx={{background: "grey", borderRadius: "50%", width: 25, height: 25, textAlign: "center", color: "white"}}>
                      {msg?.count &&  msg?.count > 9 ? "9+" : msg.count}
                    </Typography>
                  </Stack>
                </Stack>
                </Link>
              );
            })}
    </Stack>
  )
}

export default RecentChatsList