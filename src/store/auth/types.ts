import { Action } from "redux";

import { RequestStatus } from "../../utils/rest-api";

/**
 * Store Types
 */

// complete store type
export interface IUpdateAuthState {
    requestStatus: RequestStatus
    isLogin: boolean
    isLocal: boolean
    userName: string
    socialAuthToken: string
    apiToken: string
    expireDateTime: string
    avatarUrl: string
}

export enum RequestedLoginMode {
    PREFILL = "prefill",
    SOCIAL_AUTH = "social_auth",
    LOCAL = "local"
}

// async partial store types
export interface IRequestedLoginAuthState {
    requestStatus: RequestStatus
}

export interface IRequestedLogoutAuthState {
    requestStatus: RequestStatus
}

export interface ISuccessAuthState {
    requestStatus: RequestStatus
    isLogin: boolean
    isLocal: boolean
    userName: string
    expireDateTime: string
    apiToken: string
    avatarUrl: string
}

export interface IFailureAuthState {
    requestStatus: RequestStatus,
    error: any
}

// add more state types for this reducer - auth reducer
// ...





/**
 * Action Types
 */

export enum AuthActionNames {
    UPDATE_AUTH = "Update auth",
    REQUESTED_LOGIN_AUTH = "Requested login auth",
    REQUESTED_LOGOUT_AUTH = "Requested logout auth",
    SUCCESS_AUTH = "Success auth",
    FAILURE_AUTH = "Failure auth",

    // 1. add more action for this reducer - auth reducer
    // 2. write the type interface for the action below
    // ...
}

export interface IUpdateAuthAction extends Action<AuthActionNames.UPDATE_AUTH> {
    type: typeof AuthActionNames.UPDATE_AUTH;
    payload: IUpdateAuthState;
}

export interface RequestedLoginAuthActionParams {
    username?: string,
    password?: string,
    socialAuthToken?: string
}

export interface IRequestedLoginAuthAction extends Action<AuthActionNames.REQUESTED_LOGIN_AUTH> {
    type: typeof AuthActionNames.REQUESTED_LOGIN_AUTH;
    loginMode: RequestedLoginMode;
    params?: RequestedLoginAuthActionParams;
    payload: IRequestedLoginAuthState;
}

export interface IRequestedLogoutAuthAction extends Action<AuthActionNames.REQUESTED_LOGOUT_AUTH> {
    type: typeof AuthActionNames.REQUESTED_LOGOUT_AUTH;
    payload: IRequestedLogoutAuthState;
}

export interface ISuccessAuthAction extends Action<AuthActionNames.SUCCESS_AUTH> {
    type: typeof AuthActionNames.SUCCESS_AUTH;
    payload: ISuccessAuthState;
}

export interface IFailureAuthAction extends Action<AuthActionNames.FAILURE_AUTH> {
    type: typeof AuthActionNames.FAILURE_AUTH;
    payload: IFailureAuthState;
}

// use union | ... | ... to add more action types
export type TAuthActions = IUpdateAuthAction | IRequestedLoginAuthAction | IRequestedLogoutAuthAction | ISuccessAuthAction | IFailureAuthAction