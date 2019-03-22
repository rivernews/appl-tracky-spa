import { IUpdateAuthState } from "./auth/types";
import { RouterState } from 'connected-react-router' // this will add attribute "router: RouterState"

export interface IRootState {
    router: RouterState

    // add more state types here here (for each reducer)
    auth: IUpdateAuthState;
    // ...
}