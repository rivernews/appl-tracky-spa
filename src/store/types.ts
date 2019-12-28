import { IUpdateAuthState } from "./auth/types";

import { IObjectStore } from "./rest-api-redux-factory";
import { Company, companyGroupTypes } from "./data-model/company";
import { Application } from "./data-model/application";
import { ApplicationStatus } from "./data-model/application-status";

import { RouterState } from 'connected-react-router' // this will add attribute "router: RouterState"


export type IRootState = {
    router?: RouterState;
    auth: IUpdateAuthState;
    company: IObjectStore<Company>;
    application: IObjectStore<Application>;
    applicationStatus: IObjectStore<ApplicationStatus>;
    // add more state types here here (for each reducer)
    // ...
} & {
    [key in companyGroupTypes]: IObjectStore<Company>;
}
