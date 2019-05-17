import { Reducer, Action } from 'redux';

import { 
    /** store */
    IUpdateAuthState, 
    /** action */
    AuthActionNames, TAuthActions 
} from "./types";

import { RequestStatus } from "../../utils/rest-api";

const initialAuthState: IUpdateAuthState = {
    requestStatus: RequestStatus.SUCCESS,
    isLogin: false,
    isLocal: false,
    socialAuthToken: "",
    apiToken: "",
    userName: "",
    expireDateTime: "",
    avatarUrl: "",
}

// authStore will be stored as a sub-entry in global store; this is defined in ./store/types.ts
export const authReducer: Reducer<IUpdateAuthState> = (authStore = initialAuthState, action: Action)  => {
    // add reducer for new actions here
    // ...

    const authAction = action as TAuthActions;

    return {
        ...authStore,
        ...authAction.payload
    }
}