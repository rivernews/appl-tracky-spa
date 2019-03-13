import { AuthStateType, AuthActionTypeNames, UpdateAuthActionTypes } from "./types";

const initialState: AuthStateType = {
    isLogin: false,
    token: "",
    userName: "",
    expireDateTime: ""
}

export const authReducer = (state = initialState, action: UpdateAuthActionTypes): AuthStateType => {
    switch (action.type) {
        case AuthActionTypeNames.UPDATE_AUTH:
            return {
                ...state,
                ...action.payload
            }
    
        default:
            return state
    }
}