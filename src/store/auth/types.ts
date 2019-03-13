export interface AuthStateType {
    isLogin: boolean,
    userName: string,
    token: string,
    expireDateTime: string,
}

export const enum AuthActionTypeNames {
    UPDATE_AUTH = "Update auth"
}

interface UpdateAuthActionType {
    type: typeof AuthActionTypeNames.UPDATE_AUTH
    payload: AuthStateType
}

export type UpdateAuthActionTypes = UpdateAuthActionType // use union | ... | ... to add more action types