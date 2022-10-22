import { Avatar, Typography } from "@mui/material";
import { Stack } from "@mui/system";
import React  from "react";
import {  useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { styled } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import MoreIcon from '@mui/icons-material/MoreVert';

const UsersList = () => {
  const {  user: me, userList  } = useSelector((state) => state.AppReducer);

  const StyledToolbar = styled(Toolbar)(({ theme }) => ({
    alignItems: 'flex-start',
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(2),
    // Override media queries injected by theme.mixins.toolbar
    '@media all': {
      minHeight: 80,
      
    },
  }));

  return (
    <Stack>
      <Stack>
          <Box sx={{ flexGrow: 1 }}>
          <AppBar position="static">
            <StyledToolbar>
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="open drawer"
                sx={{ mr: 2 }}
              >
                <MenuIcon />
              </IconButton>

              <IconButton 
              size="large" 
              edge="end"  
              aria-label="search"
               color="inherit" 
               sx={{display: 'flex', marginLeft :'auto'}}>
                <SearchIcon />
              </IconButton>
              
              <IconButton
                size="large"
                aria-label="display more actions"
                edge="end"
                color="inherit"
                sx={{display: 'flex', marginLeft :'auto'}}
              >
                <MoreIcon/>
              </IconButton>
            </StyledToolbar>
          </AppBar>
        </Box>
      </Stack>
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
            .filter((u) => u.id !== me.id)
            .map((user) => {
              return (
                <Link to={"/chat/"+user.id}>
                <Stack
                  sx={{
                    width: "100%",
                    height: "80px",
                    alignItems: "center",
                    borderBottom: "1px solid grey",
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
                    <Avatar />
                  )}
                  <Typography variant="h5" sx={{ ml: 2, alignSelf: "center" }}>
                    {user.name}
                  </Typography>
                </Stack>
                </Link>
              );
            })}
        </Stack>
    </Stack>

  );
};

export default UsersList;
