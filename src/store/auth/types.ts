/**
 * Store Types
 */
export interface IAuthState {
    isLogin: boolean,
    userName: string,
    token: string,
    expireDateTime: string,
}

// add more state types for this reducer - auth reducer
// ...

/**
 * Action Types
 */
export enum AuthActionNames {
    UPDATE_AUTH = "Update auth"

    // 1. add more action for this reducer - auth reducer
    // 2. write the type interface for the action below
    // ...
}

export interface IUpdateAuthAction {
    type: typeof AuthActionNames.UPDATE_AUTH;
    payload: IAuthState;
}

export type TAuthActions = IUpdateAuthAction // use union | ... | ... to add more action types