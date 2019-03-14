import { IAuthState } from "./auth/types";

export interface IRootState {
    auth: IAuthState

    // add more state types here here (for each reducer)
    // ...
}