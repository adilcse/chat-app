import { LOGIN, LOGOUT, RECENT_MSSAGES, UPDATE_USER_LIST } from "../constants"

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
    recentMessages: [],
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
                    ...defaultState
                }
            case UPDATE_USER_LIST:
                return {
                    ...state,
                    userList: action.payload,
                }
            case RECENT_MSSAGES:
                return {
                    ...state,
                    recentMessages: [action.payload, ...state.recentMessages].sort((a,b) => b.createdAt - a.createdAt)
                }
        default:
            return {...state}
    }
}
export default AppReducer;