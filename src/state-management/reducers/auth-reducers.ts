import { Reducer, Action } from 'redux';

import {
    /** store */
    IUpdateAuthState,
    /** action */
    AuthActionNames, TAuthActions, AuthActionNamesValue
} from "../types/auth-types";

import { RequestStatus } from "../../utils/rest-api";

const initialAuthState: IUpdateAuthState = {
    // if iniitally user is in private/inner page, the App will start requesting auth anyway;
    // if user enters from home landing page, the App should still start requesting auth, and redirect user to private/inner page if logged in
    requestStatus: RequestStatus.TRIGGERED,
    isLogin: false,
    isLocal: undefined,
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

    if (!(AuthActionNamesValue.includes(action.type))) {
        return authStore;
    }

    const authAction = action as TAuthActions;

    if (authAction.type === AuthActionNames.SUCCESS_AUTH) {
        localStorage.setItem(process.env.NODE_ENV === 'development' ? 'dev__applyTracky__authState' : 'applyTracky__authState', JSON.stringify(authAction.payload));
    }

    return {
        ...authStore,
        ...authAction.payload
    }
}