import { Alert, Avatar, Box, Button, Fab, Modal, Snackbar, Stack, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react'; 
import AppHeader from '../components/AppHeader';
import CircularProgress from '@mui/material/CircularProgress';
import { addNewGroup } from '../firestoreHelper';
import { AddToQueueSharp } from '@mui/icons-material';
import { Link } from "react-router-dom/cjs/react-router-dom";
import {  useSelector } from 'react-redux';
  
const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    pt: 2,
    px: 4,
    pb: 3,
  };
  
  const AddGroupModal = ({open, onClose, onSubmit}) => {
    const [newGroup, setNewGroup] = useState({
        name: '',
        description: ''
    });
    useEffect(()=> {
        setNewGroup({
            name: '',
            description: ''
        })
    }, [open]);
    return (<Modal
    open={open}
    onClose={onClose}
    aria-labelledby="Add group modal"
    aria-describedby="Modal to add new groups">
        <Box sx={{ ...style, width: 400 }}>
            <h2 id="parent-modal-title">Add New Group</h2>
            <TextField value={newGroup?.name} onChange={(e) => setNewGroup(old => ({...old, name: e.target.value}))} placeholder='Enter Group Name'/>
            <TextField value={newGroup?.description} onChange={(e) => setNewGroup(old => ({...old, description: e.target.value}))} multiline fullWidth minRows={2} sx={{mt: 2, mb:2}} placeholder='Enter Description'/>
            <div>The group will be created based on your location and will be visible in 20km radius</div>
            <Button sx={{mt:2, mb:2}} variant="contained" onClick={() => onSubmit(newGroup)}>Create</Button>
        </Box>
    </Modal>)
}

const NearbyThreads = () => {
    const { nearbyThreads} = useSelector(state => state.AppReducer);

    return (<Stack
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
        {nearbyThreads
                .map((thread) => {
                  return (
                    <Link style={{maxWidth: "90%"}} key={thread?.docId || thread?.createdAt} to={"/thread/"+thread?.docId}>
                    <Stack
                      sx={{
                        width: "100%",
                        maxWidth: "90%",
                        height: "80px",
                        alignItems: "center",
                        borderBottom: "1px solid grey",
                        px: 2,
                      }}
                      direction="row"
                    >
                      {thread.image ? (
                        <img
                          style={{ borderRadius: "50%" }}
                          src={thread?.image}
                          alt={thread?.name}
                          width={50}
                          height={50}
                        />
                      ) : (
                        <Avatar sx={{width: 50, height: 50}} />
                      )}
                      <Stack>
                      <Typography variant="h5" sx={{ ml: 2, }}>
                        {thread?.name}
                      </Typography>
                      <Typography variant="body1" sx={{ ml: 2, alignSelf: "left",  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis', }}>
                        {thread?.description}
                      </Typography>
                      </Stack>
                      <Stack sx={{ml: "auto"}}>
                        <Typography sx={{background: "grey", borderRadius: "50%", width: 25, height: 25, textAlign: "center", color: "white"}}>
                          {1}
                        </Typography>
                      </Stack>
                    </Stack>
                    </Link>
                  );
                })}
        </Stack>
      );
} 
const NearMe = () => {
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success'
      });

    const [addGroupModalOpen, setAddGroupModalOpen] = useState(false);
    const {location, user: me} = useSelector(state => state.AppReducer);

    const handleGroupCreate = (newGroup) => {
        console.log("group creating: ", newGroup);
        if (!location.geoHash) {
            setSnackbar({ ...snackbar, severity: 'error', open: true, message: `Please enable location to create ne group`})
        }
        if (newGroup?.name?.length > 3) {
            addNewGroup(newGroup.name, newGroup.description, location, me?.id).then((resp)=> {
                if (resp) {
                    setSnackbar({ ...snackbar,  severity: 'success', open: true, message: `New Thread named ${newGroup?.name} Created Sucessfully`});
                    
                } else {
                    setSnackbar({ ...snackbar, severity: 'error', open: true, message: `Failed to create froup`})
                }
            }).catch(err => {
                console.error(err);
            });
        setAddGroupModalOpen(false);

        } else {
            setSnackbar({ ...snackbar, severity: 'error', open: true, message: "name must be more then 3 charecters"})
        }
    }


    return (<Stack >
        <AppHeader/>
        <Stack sx={{
        mx: {
            sm: 1,
            md: 2,
            lg: 3
        }
    }}>
        <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal:'right' }}
        open={snackbar.open}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        autoHideDuration={5000}
      >
        <Alert
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            severity={snackbar.severity}
            variant="filled"
            sx={{ width: '100%' }}
        >
            {snackbar.message}
        </Alert>
      </Snackbar>
        <AddGroupModal
            open={addGroupModalOpen}
            onClose={() => setAddGroupModalOpen(false)}
            onSubmit={handleGroupCreate}/>
        <Stack direction={"row"} sx={{
            maxWidth: {
                sm: '95%',
                md: '80%',
                lg: '60%' 
            },
            mt:2,
            mx:2,
            alignSelf: "center"
            
        }}>
            <Typography variant="h4" component="h4">
            Threads Near me
            </Typography>
          
        </Stack>
        <Stack sx={{justifyContent: "center", alignItems: "center", mt: 4}}>
          <NearbyThreads />
        </Stack>
        </Stack>
        <Fab
        onClick={() => setAddGroupModalOpen(true)}
          color="primary"
          aria-label="Add Thread"
          sx={{
            position: "absolute",
            bottom: 16,
            right: 16,
          }}
        >
          <AddToQueueSharp />
        </Fab>
    </Stack>)
}
export default NearMe;