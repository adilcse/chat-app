import { Fab, Typography } from "@mui/material";
import { Stack } from "@mui/system";
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import RefreshIcon from "@mui/icons-material/Refresh";
import { getUsersList } from "../firestoreHelper";
import { updateUsersListAction } from "../redux/action/Action";
import AllUsersList from "../components/AllUsersList";
import RecentChatsList from "../components/RecentChatsList";
import useWindowSize from "../hooks/useWindowSize";
import { AddComment, LocationOnRounded } from "@mui/icons-material";
import { Link } from "react-router-dom/cjs/react-router-dom";
import AppHeader from "../components/AppHeader";
const rotate = {
  transform: "rotate(360deg)",
  transition: "transform 500ms ease", // smooth transition
};
const UsersList = () => {
  const {
    user: me,
    userList,
    isLoggedIn,
    recentMessages,
  } = useSelector((state) => state.AppReducer);
  const [refreshing, setRefreshing] = useState(false);
  const dispatch = useDispatch();
  const [, height] = useWindowSize();

  const refresh = () => {
    if (isLoggedIn) {
      setRefreshing(true);
      getUsersList(me)
        .then((u) => {
          setRefreshing(false);
          dispatch(updateUsersListAction(u));
        })
        .catch((e) => {
          setRefreshing(false);
        });
    }
  };

  useEffect(() => {
    refresh();
  }, [me]);

  const userListWithoutMe = useMemo(
    () => userList.filter((u) => u.id !== me.id),
    [userList, me]
  );
  return (
    <Stack>
      <AppHeader />
      <Fab
        onClick={refresh}
        color="primary"
        aria-label="Refresh"
        sx={{
          position: "absolute",
          bottom: 16,
          right: 16,
        }}
      >
        <RefreshIcon style={refreshing ? rotate : {}} />
      </Fab>
      <Link to="/addcontact">
        <Fab
          color="primary"
          aria-label="Refresh"
          sx={{
            position: "absolute",
            bottom: 100,
            right: 16,
          }}
        >
          <AddComment />
        </Fab>
      </Link>
      <Link to="/nearme">
        <Fab
          color="primary"
          aria-label="Refresh"
          sx={{
            position: "absolute",
            bottom: 190,
            right: 16,
          }}
        >
          <LocationOnRounded />
        </Fab>
      </Link>
      <Stack
        sx={{
          overflowY: "scroll",
          overflowX: "hidden",
          maxHeight: height - 100,
        }}
      >
        {recentMessages && recentMessages.length ? (
          <>
            <Typography variant="h5" sx={{ ml: 2, mt: 2 }}>
              Recent chats:
            </Typography>
            <RecentChatsList recentMessages={recentMessages || []} />
          </>
        ) : (
          <></>
        )}
        {userListWithoutMe?.length ? (
          <>
            <Typography variant="h5" sx={{ ml: 2, mt: 3 }}>
              Other contacts:
            </Typography>
            <AllUsersList userList={userListWithoutMe} />{" "}
          </>
        ) : (
          <Typography variant="h5" sx={{ mx: "auto" }}>
            Add someone to your chat
          </Typography>
        )}
      </Stack>
    </Stack>
  );
};

export default UsersList;
