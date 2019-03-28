import { IUpdateAuthState } from "./auth/types";

import { IObjectStore } from "./rest-api-redux-factory";
import { Company } from "./company/company";
import { Address } from "./address/address";


import { RouterState } from 'connected-react-router' // this will add attribute "router: RouterState"

export interface IRootState {
    router: RouterState

    // add more state types here here (for each reducer)
    auth: IUpdateAuthState
    company: IObjectStore<Company>
    address: IObjectStore<Address>
    // ...
}