import { Avatar, Stack, Typography } from '@mui/material'
import React from 'react'
import { Link } from 'react-router-dom';

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
                  <Typography variant="h5" sx={{ ml: 2, alignSelf: "center" }}>
                    {user.name}
                  </Typography>
                </Stack>
                </Link>
              );
            })}
    </Stack>
  )
}

export default AllUsersList