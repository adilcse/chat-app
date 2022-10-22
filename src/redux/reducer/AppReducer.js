import { LOGIN, LOGOUT, UPDATE_USER_LIST } from "../constants"

const defaultState = {
    user: {
        name: "",
        email: "",
        id: "",
        image: "",
        token: "token",
        createdAt: {}
    },
    userList: [],
    isLoggedIn: false
}
const AppReducer = (state=defaultState, action={}) => {
    switch(action.type) {
        case LOGIN:
            return {
                ...state,
                isLoggedIn: true,
                user: action.payload
            }
            case LOGOUT:
                return {
                    ...state,
                    isLoggedIn: false,
                    user: defaultState.user
                }
            case UPDATE_USER_LIST:
                return {
                    ...state,
                    userList: action.payload,
                }
        default:
            return {...state}
    }
}
export default AppReducer;