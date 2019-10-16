import {
    /** state types */
    IUpdateAuthState,
    RequestedLoginMode,
    /** action types */
    IUpdateAuthAction,
    IRequestedLoginAuthAction,
    RequestedLoginAuthActionParams,
    IRequestedLogoutAuthAction,
    ISuccessAuthAction,
    IFailureAuthAction,
    /** action names */
    AuthActionNames,
} from "./types";

import { RequestStatus } from "../../utils/rest-api";

export const UpdateAuth = (newAuthState: IUpdateAuthState): IUpdateAuthAction => {
    return {
        type: AuthActionNames.UPDATE_AUTH,
        payload: newAuthState
    };
};

export const RequestedLoginAuth = (loginMode: RequestedLoginMode, params?: RequestedLoginAuthActionParams, onCompleteCallback?: () => void): IRequestedLoginAuthAction => {
    return {
        type: AuthActionNames.REQUESTED_LOGIN_AUTH,
        loginMode,
        params,
        payload: {
            requestStatus: RequestStatus.REQUESTING,
        },
        onCompleteCallback
    };
};

export const RequestedLogoutAuth = (): IRequestedLogoutAuthAction => {
    return {
        type: AuthActionNames.REQUESTED_LOGOUT_AUTH,
        payload: {
            requestStatus: RequestStatus.REQUESTING,
        }
    };
};

export const SuccessLoginAuth = (userName: string, expireDateTime: string, apiToken: string, avatarUrl: string, isLocal: boolean): ISuccessAuthAction => {
    process.env.NODE_ENV === 'development' && console.log("action username:", userName);

    return {
        type: AuthActionNames.SUCCESS_AUTH,
        payload: {
            requestStatus: RequestStatus.SUCCESS,
            isLogin: true,
            isLocal: isLocal ? true : false,
            userName,
            expireDateTime,
            apiToken,
            avatarUrl
        }
    };
};

export const SuccessLogoutAuth = (): ISuccessAuthAction => {
    return {
        type: AuthActionNames.SUCCESS_AUTH,
        payload: {
            requestStatus: RequestStatus.SUCCESS,
            isLogin: false,
            isLocal: false,
            userName: "",
            expireDateTime: "",
            apiToken: "",
            avatarUrl: "",
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
