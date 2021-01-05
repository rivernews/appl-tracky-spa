import { IUpdateAuthState } from "./auth-types";

import { IObjectBase, IObjectStore } from "./factory-types";
import { Company, companyGroupTypes } from "../../data-model/company/company";
import { Application } from "../../data-model/application/application";
import { ApplicationStatus } from "../../data-model/application-status/application-status";

import { RouterState } from 'connected-react-router' // this will add attribute "router: RouterState"
import { ISelectCompanyState } from "./select-company-types";
import { IUserAppPageState } from "./user-app-page-types";


export type IRootState = {
    router?: RouterState;
    auth: IUpdateAuthState;
    company: IObjectStore<Company>;
    application: IObjectStore<Application>;
    applicationStatus: IObjectStore<ApplicationStatus>;

    searchCompany: IObjectStore<IObjectBase>;
    
    selectCompany: ISelectCompanyState;
    userAppPage: IUserAppPageState;
    
    // add more state types here here (for each reducer)
    // ...
} & {
    [key in companyGroupTypes]: IObjectStore<Company>;
}
