import { LOGIN, LOGOUT, RECENT_MSSAGES, UPDATE_USER_LIST, ADD_RECENT_MSSAGES, UPDATE_LOCATION, UPDATE_THREADS, REFRESH_THREADS } from "../constants"

export const LoginAction = (value) => {
    return {
        type: LOGIN,
        payload: value
    }
}

export const UpdateLocationAction = (value) => {
    return {
        type: UPDATE_LOCATION,
        payload: value
    }
}

export const UpdateNearbyThreads = (data) => {
    return {
        type: UPDATE_THREADS,
        payload: data
    }
}

export const RefreshNearbyThreads = () => {
    return {
        type: REFRESH_THREADS,
    }
}
export const LoginOutAction = () => {
    return {
        type: LOGOUT,
    }
}
export const updateUsersListAction = (value) => {
    return {
        type: UPDATE_USER_LIST,
        payload: value
    }
}

export const updateRecentMessageAction = (value) => {
    return {
        type: RECENT_MSSAGES,
        payload: value
    }
}
 
export const AddRecentMessageAction = (value) => {
    return {
        type: ADD_RECENT_MSSAGES,
        payload: value
    }
}