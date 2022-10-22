import { Divider, Fab, Typography } from "@mui/material";
import { Stack } from "@mui/system";
import React, { useMemo, useState }  from "react";
import {  useDispatch, useSelector } from "react-redux";
import { styled } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import RefreshIcon from '@mui/icons-material/Refresh';
import { getUsersList } from "../firestoreHelper";
import { updateUsersListAction } from "../redux/action/Action";
import UserProfileMenu from "../components/UserProfileMenu";
import AllUsersList from "../components/AllUsersList";
import RecentChatsList from "../components/RecentChatsList";
import useWindowSize from "../hooks/useWindowSize";
const rotate = {
  transform: 'rotate(360deg)', 
  transition: 'transform 500ms ease', // smooth transition
 }
const UsersList = () => {
  const {  user: me, userList, isLoggedIn, recentMessages  } = useSelector((state) => state.AppReducer);
  const [refreshing, setRefreshing] = useState(false)
  const dispatch = useDispatch();
  const [width, height] = useWindowSize();
  const StyledToolbar = styled(Toolbar)(({ theme }) => ({
    alignItems: 'flex-start',
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(2),
    // Override media queries injected by theme.mixins.toolbar
    '@media all': {
      minHeight: 50,
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
  const userListWithoutMe = useMemo(() => userList.filter(u => u.id !== me.id), [userList, me])
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
              
              <UserProfileMenu user ={me}/>
            </StyledToolbar>
          </AppBar>
        </Box>
      </Stack>
      <Fab onClick={refresh} color="primary" aria-label="Refresh" sx={{ 
            position: 'absolute',
            bottom: 16,
            right: 16,
            }}>
            <RefreshIcon style={refreshing ? rotate : {}} />
          </Fab>
        <Stack sx={{overflowY: "scroll", overflowX: "hidden", maxHeight: height-100}}>
        {recentMessages && recentMessages.length && <>
        <Typography variant="h5" sx={{ml: 2}}>Recent:</Typography>
      <RecentChatsList recentMessages={recentMessages || []} />      
      <Divider />
      </>}
      <Typography variant="h5" sx={{ml: 2}}>All:</Typography>
      <AllUsersList userList={userListWithoutMe} />
        </Stack>
    </Stack>

  );
};

export default UsersList;
