import { IUpdateAuthState } from "./auth-types";

import { IObjectStore } from "./factory-types";
import { Company, companyGroupTypes } from "../../data-model/company/company";
import { Application } from "../../data-model/application/application";
import { ApplicationStatus } from "../../data-model/application-status/application-status";

import { RouterState } from 'connected-react-router' // this will add attribute "router: RouterState"
import { ISelectCompanyState } from "./select-company-types";


export type IRootState = {
    router?: RouterState;
    auth: IUpdateAuthState;
    company: IObjectStore<Company>;
    application: IObjectStore<Application>;
    applicationStatus: IObjectStore<ApplicationStatus>;

    selectCompany: ISelectCompanyState;
    
    // add more state types here here (for each reducer)
    // ...
} & {
    [key in companyGroupTypes]: IObjectStore<Company>;
}
