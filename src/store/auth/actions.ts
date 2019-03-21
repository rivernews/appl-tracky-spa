import {
    /** state types */
    IUpdateAuthState,
    IRequestedAuthState,
    /** action types */
    IUpdateAuthAction,
    IRequestedAuthAction,
    ISuccessAuthAction,
    IFailureAuthAction,
    /** action names */
    AuthActionNames
} from "./types";

import { RequestStatus } from "../../utils/rest-api";

export const UpdateAuth = (newAuthState: IUpdateAuthState): IUpdateAuthAction => {
    return {
        type: AuthActionNames.UPDATE_AUTH,
        payload: newAuthState
    };
};

export const RequestedAuth = (socialAuthToken: string): IRequestedAuthAction => {
    return {
        type: AuthActionNames.REQUESTED_AUTH,
        payload: {
            requestStatus: RequestStatus.REQUESTING,
            socialAuthToken
        }
    };
};

export const SuccessAuth = (userName: string, expireDateTime: string): ISuccessAuthAction => {
    return {
        type: AuthActionNames.SUCCESS_AUTH,
        payload: {
            requestStatus: RequestStatus.SUCCESS,
            isLogin: true,
            userName,
            expireDateTime
        }
    };
};

export const FailureAuth = (error: any): IFailureAuthAction => {
    return {
        type: AuthActionNames.FAILURE_AUTH,
        payload: {
            requestStatus: RequestStatus.FAILURE,
            error
        }
    };
};

// write new actions here for this reducer - auth reducer
// ...
