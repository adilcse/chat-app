import { Avatar, Fab, Typography } from "@mui/material";
import { Stack } from "@mui/system";
import React, { useState }  from "react";
import {  useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { styled } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import MoreIcon from '@mui/icons-material/MoreVert';
import RefreshIcon from '@mui/icons-material/Refresh';
import { getUsersList } from "../firestoreHelper";
import { updateUsersListAction } from "../redux/action/Action";
const rotate = {
  transform: 'rotate(360deg)', 
  transition: 'transform 500ms ease', // smooth transition
 }
const UsersList = () => {
  const {  user: me, userList, isLoggedIn  } = useSelector((state) => state.AppReducer);
  const [refreshing, setRefreshing] = useState(false)
  const dispatch = useDispatch();
  const StyledToolbar = styled(Toolbar)(({ theme }) => ({
    alignItems: 'flex-start',
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(2),
    // Override media queries injected by theme.mixins.toolbar
    '@media all': {
      minHeight: 80,
      
    },
  }));

  const refresh = () => {
    if (isLoggedIn) {
      setRefreshing(true);
      getUsersList().then((u) => {
      setRefreshing(false);
        dispatch(updateUsersListAction(u))
      }).catch((e) => {
      setRefreshing(false);
      });
    }
  }
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
                    <Avatar />
                  )}
                  <Typography variant="h5" sx={{ ml: 2, alignSelf: "center" }}>
                    {user.name}
                  </Typography>
                </Stack>
                </Link>
              );
            })}
          <Fab onClick={refresh} color="primary" aria-label="Refresh" sx={{ 
            position: 'absolute',
            bottom: 16,
            right: 16,
            }}>
            <RefreshIcon style={refreshing ? rotate : {}} />
          </Fab>
        </Stack>
    </Stack>

  );
};

export default UsersList;
