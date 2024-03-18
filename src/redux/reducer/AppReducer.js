import { ADD_RECENT_MSSAGES, LOGIN, LOGOUT, RECENT_MSSAGES, REFRESH_THREADS, UPDATE_LOCATION, UPDATE_THREADS, UPDATE_USER_LIST } from "../constants"

const defaultState = {
    user: {
        name: "",
        email: "",
        id: "",
        image: "",
        token: "token",
        createdAt: {},
    },
    location: {
        latitude: null,
        longitude: null
    },
    userList: [],
    recentMessages: [],
    isLoggedIn: false,
    nearbyThreads: [],
    threadRefresh: 0
}
const AppReducer = (state=defaultState, action={}) => {
    switch(action.type) {
        case LOGIN:
            return {
                ...state,
                isLoggedIn: true,
                user: action.payload
            }
        case UPDATE_LOCATION:
            return {
                ...state,
                location: action.payload
            }
        case UPDATE_THREADS:
            return {
                ...state,
                nearbyThreads: action.payload
            }
        case REFRESH_THREADS:
            return {
                ...state,
                threadRefresh: state.threadRefresh + 1
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
            case ADD_RECENT_MSSAGES:
                return {
                    ...state,
                    recentMessages: action.payload?.sort((a,b) => b.createdAt - a.createdAt)
                }
        default:
            return {...state}
    }
}
export default AppReducer;