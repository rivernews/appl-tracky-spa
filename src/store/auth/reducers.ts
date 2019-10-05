import { Reducer, Action } from 'redux';

import { 
    /** store */
    IUpdateAuthState, 
    /** action */
    AuthActionNames, TAuthActions 
} from "./types";

import { RequestStatus } from "../../utils/rest-api";

let sessionAuthState = sessionStorage.getItem('authState') ? JSON.parse(sessionStorage.getItem('authState') || '{}') : {};

const initialAuthState: IUpdateAuthState = (sessionAuthState.requestStatus) ?sessionAuthState : { // check if sessionAuthState is empty {} or indeed has state content
    requestStatus: RequestStatus.SUCCESS, // initial status just set to SUCCESS
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

    if (authAction.type === AuthActionNames.SUCCESS_AUTH) {
        sessionStorage.setItem('authState', JSON.stringify(authAction.payload));
    }

    return {
        ...authStore,
        ...authAction.payload
    }
}