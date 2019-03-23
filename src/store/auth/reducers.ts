import { 
    /** store */
    IUpdateAuthState, 
    /** action */
    AuthActionNames, TAuthActions 
} from "./types";

import { RequestStatus } from "../../utils/rest-api";

const initialAuthState: IUpdateAuthState = {
    requestStatus: RequestStatus.SUCCESS,
    isLogin: true,
    socialAuthToken: "",
    apiToken: "",
    userName: "",
    expireDateTime: "",
}

// authStore will be stored as a sub-entry in global store; this is defined in ./store/types.ts
export const authReducer = (authStore = initialAuthState, action: TAuthActions): IUpdateAuthState => {
    // add reducer for new actions here
    // ...

    return {
        ...authStore,
        ...action.payload
    }
}