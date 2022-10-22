import { LOGIN, LOGOUT, UPDATE_USER_LIST } from "../constants"

export const LoginAction = (value) => {
    return {
        type: LOGIN,
        payload: value
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
 