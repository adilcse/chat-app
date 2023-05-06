import { Stack } from '@mui/material';
import React, { useMemo, useState } from 'react'; 
import AppHeader from '../components/AppHeader';
import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';
import SearchInput from '../components/SearchInput';
import AllUsersList from '../components/AllUsersList';
import { addFirebaseUserContact, searchUsersList } from '../firestoreHelper';
import SearchList from '../components/SearchList';
import { useHistory } from 'react-router-dom/cjs/react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { LoginAction, updateUsersListAction } from '../redux/action/Action';
  

  
const AddContact = () => {
    const [users,setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const {userList, user: me} = useSelector(state => state.AppReducer);
    const dispatch = useDispatch()
    const history = useHistory();
    const onSearch = async (text) => {
        if (text.length >= 3) {
            setLoading(true);
            const usersList = await searchUsersList("email", text);
            setUsers(usersList);
            setLoading(false);
        }
    }
    const onAddClick = async(user) => {
        const {success, data: updatedUser} = await addFirebaseUserContact(me, user.id);
        console.log(updatedUser)
        if (success){
            dispatch(LoginAction(updatedUser));
        }
    }
    const onMessage = (user) => {
        if (!userList.find(u => u.id === user.id)){
            dispatch(updateUsersListAction([user, ...userList]))
        }
        history.push('/chat/'+ user.id);
    }
  const userListWithoutMe = useMemo(() => users.filter(u => u.id !== me.id), [users, me])

    return <Stack >
        <AppHeader/>
        <Stack sx={{
        mx: {
            sm: 1,
            md: 2,
            lg: 3
        }
    }}>
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
        <SearchInput sx={{width: '100%'}} onSearch={onSearch}/>
        </Stack>
        <Stack sx={{justifyContent: "center", alignItems: "center", mt: 4}}>
            {
            loading ? <CircularProgress/> : <SearchList user ={me} userList={userListWithoutMe} onAddClick={onAddClick} onMessage={onMessage}/>
        }
        </Stack>
        </Stack>
    </Stack>
}
export default AddContact;