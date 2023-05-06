import styled from '@emotion/styled';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import UserProfileMenu from "./UserProfileMenu";
import { AppBar, Box, IconButton, Stack, Toolbar } from '@mui/material'
import React from 'react'
import { useSelector } from 'react-redux';
import { Home } from '@mui/icons-material';
import { Link } from 'react-router-dom/cjs/react-router-dom';


function AppHeader() {
    const {user: me} = useSelector((state) => state.AppReducer);
    const StyledToolbar = styled(Toolbar)(({ theme }) => ({
        alignItems: 'flex-start',
        paddingTop: 1,
        paddingBottom: 2,
        // Override media queries injected by theme.mixins.toolbar
        '@media all': {
          minHeight: 50,
        },
      }));
  return (
    <Stack>
    <Box sx={{ flexGrow: 1 }}>
    <AppBar position="static">
      <StyledToolbar>
        <Link to={"/"}>
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="open drawer"
          sx={{ mr: 2 }}
        >
          <Home />
        </IconButton>
        </Link>

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
  )
}

export default AppHeader