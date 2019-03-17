import { IAuthState, AuthActionNames } from "./types";

export const UpdateAuth = (newUpdate: IAuthState) => {
  return {
    type: AuthActionNames.UPDATE_AUTH,
    payload: newUpdate
  };
};

// write new actions here for this reducer - auth reducer
// ...