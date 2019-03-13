import { AuthStateType, AuthActionTypeNames } from "./types";

export const updateAuthAction = (newUpdate: AuthStateType) => {
  return {
    type: AuthActionTypeNames.UPDATE_AUTH,
    payload: newUpdate
  };
};
