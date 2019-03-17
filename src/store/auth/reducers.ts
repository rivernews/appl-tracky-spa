import { 
    /** store */
    IAuthState, 
    /** action */
    AuthActionNames, TAuthActions 
} from "./types";

const initialState: IAuthState = {
    isLogin: false,
    token: "",
    userName: "",
    expireDateTime: ""
}

export const authReducer = (state = initialState, action: TAuthActions): IAuthState => {
    switch (action.type) {
        case AuthActionNames.UPDATE_AUTH:
            return {
                ...state,
                ...action.payload
            }
        
        // add reducer for new actions here
        // ...
    
        default:
            return state
    }
}