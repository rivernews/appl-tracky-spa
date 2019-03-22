import { RequestStatus } from "../../utils/rest-api";

/**
 * Store Types
 */

// complete store type
export interface IUpdateAuthState {
    requestStatus?: RequestStatus
    isLogin?: boolean
    userName?: string
    socialAuthToken?: string
    apiToken?: string
    expireDateTime?: string,
}

// async partial store types
export interface IRequestedLoginAuthState {
    requestStatus: RequestStatus
    socialAuthToken: string
}

export interface IRequestedLogoutAuthState {
    requestStatus: RequestStatus
}

export interface ISuccessAuthState {
    requestStatus: RequestStatus
    isLogin: boolean
    userName: string
    expireDateTime: string
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

export interface IUpdateAuthAction {
    type: typeof AuthActionNames.UPDATE_AUTH;
    payload: IUpdateAuthState;
}

export interface IRequestedLoginAuthAction {
    type: typeof AuthActionNames.REQUESTED_LOGIN_AUTH;
    payload: IRequestedLoginAuthState;
}

export interface IRequestedLogoutAuthAction {
    type: typeof AuthActionNames.REQUESTED_LOGOUT_AUTH;
    payload: IRequestedLogoutAuthState;
}

export interface ISuccessAuthAction {
    type: typeof AuthActionNames.SUCCESS_AUTH;
    payload: ISuccessAuthState;
}

export interface IFailureAuthAction {
    type: typeof AuthActionNames.FAILURE_AUTH;
    payload: IFailureAuthState;
}

// use union | ... | ... to add more action types
export type TAuthActions = IUpdateAuthAction | IRequestedLoginAuthAction | IRequestedLogoutAuthAction | ISuccessAuthAction | IFailureAuthAction