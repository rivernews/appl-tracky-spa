import { IUpdateAuthState } from "./auth/types";

import { IObjectStore } from "./rest-api-redux-factory";
import { Company } from "./data-model/company";
import { Address } from "./data-model/address";
import { Application } from "./data-model/application";


import { RouterState } from 'connected-react-router' // this will add attribute "router: RouterState"

export interface IRootState {
    router: RouterState

    // add more state types here here (for each reducer)
    auth: IUpdateAuthState
    company: IObjectStore<Company>
    address: IObjectStore<Address>
    application: IObjectStore<Application>
    // ...
}