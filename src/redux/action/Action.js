import { LOGIN, LOGOUT } from "../constants"

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
