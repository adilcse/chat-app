import { LOGIN, LOGOUT } from "../constants"

const defaultState = {
    user: {
        name: "",
        email: "",
        id: "",
        image: "",
        token: "token"
    },
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
        default:
            return {...state}
    }
}
export default AppReducer;