import { AnyAction } from "redux";
import { IUpdateAuthState, TAuthActions } from "./auth/types";

import { IObjectStore } from "./rest-api-redux-factory";
import { Company } from "./data-model/company";
import { Address } from "./data-model/address";
import { Application } from "./data-model/application";
import { ApplicationStatus } from "./data-model/application-status";
import { ApplicationStatusLink } from "./data-model/application-status-link";


import { RouterState } from 'connected-react-router' // this will add attribute "router: RouterState"

export interface IRootState {
    router?: RouterState

    // add more state types here here (for each reducer)
    auth: IUpdateAuthState
    company: IObjectStore<Company>
    address: IObjectStore<Address>
    application: IObjectStore<Application>
    applicationStatus: IObjectStore<ApplicationStatus>
    applicationStatusLink: IObjectStore<ApplicationStatusLink>
    // ...


}

// export type IRootState = {
//     [k in keyof (typeof rootReducer)]: ReturnType<(typeof rootReducer)[k]>
// }