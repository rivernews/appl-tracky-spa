import { IUpdateAuthState } from "./auth/types";

export interface IRootState {
    auth: IUpdateAuthState

    // add more state types here here (for each reducer)
    // ...
}