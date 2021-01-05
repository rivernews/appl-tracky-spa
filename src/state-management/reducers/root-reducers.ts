/** redux */
import { Reducer, Action } from "redux";
import { connectRouter, LocationChangeAction } from 'connected-react-router';
import { authReducer } from "./auth-reducers";
import { IRootState } from "../types/root-types";
import { IObjectStore } from "../types/factory-types";
import { RootActionNames } from "../action-creators/root-actions";
import { RestApiReducerFactory } from "./reducer-factory";
import { ApplicationStatus } from "../../data-model/application-status/application-status";
import { Application } from "../../data-model/application/application";
// rest api
import { companyGroupTypes, Company, companyGroups } from "../../data-model/company/company";

/** router */
import { History } from "history";
import { selectCompanyReducer } from "./select-company-reducers";


// create reducer for each data model

export const CompanyReducer = RestApiReducerFactory<Company>("companies");

export const GroupCompanyReducer = companyGroups.reduce((accumulated, companyGroupText) => {
    return {
        ...accumulated,
        [companyGroupText]: RestApiReducerFactory(companyGroupText)
    }
}, {}) as { [key in companyGroupTypes]: Reducer<IObjectStore<Company>> };

export const SearchCompanyReducer = RestApiReducerFactory<Company>("searchCompany");

export const ApplicationReducer = RestApiReducerFactory<Application>("applications");

export const ApplicationStatusReducer = RestApiReducerFactory<ApplicationStatus>("application-statuses");


// root reducer with router state

export const createRootReducer = (history: History<any>): Reducer<IRootState> => {
    // return combineReducers<IRootState>({
    //     router: connectRouter(history),
    
    //     // add more reducers here
    //     auth: authReducer,
    //     company: CompanyReducer,
    //     address: AddressReducer,
    //     application: ApplicationReducer,
    //     // ...
    // })

    const rootReducer: Reducer<IRootState> = (rootState: IRootState | undefined, action: Action): IRootState  => {

        let rootStateChecked: {
            [storeName: string]: any
        } = {};
        if (!rootState) {
            rootStateChecked.router = undefined;
            rootStateChecked.auth = undefined;

            rootStateChecked.company = undefined;
            companyGroups.forEach((companyGroupText) => {
                rootStateChecked[companyGroupText] = undefined;
            });

            rootStateChecked.application = undefined;
            rootStateChecked.applicationStatus = undefined;
            // add initial state for new sub-store here
            // ...
        } else if (action.type === RootActionNames.ResetAllStore) {
            // exclude all store instead of the router's
            rootStateChecked = {
                router: rootState.router
            }
        } else {
            rootStateChecked = rootState;
        }

        const afterStore = { 
            ...rootState,
            router: connectRouter(history)(rootStateChecked.router, action as LocationChangeAction),
            auth: authReducer(rootStateChecked.auth, action),

            company: CompanyReducer(rootStateChecked.company, action),
            
            // add grouped company reducers
            ...(companyGroups.reduce((accumulate, companyGroupText) => {
                const Reducer = GroupCompanyReducer[companyGroupText];
                return ({
                    ...accumulate,
                    [companyGroupText]: Reducer(rootStateChecked[companyGroupText], action)
                })
            }, {}) as {
                [key in companyGroupTypes]: IObjectStore<Company>
            }),

            searchCompany: SearchCompanyReducer(rootStateChecked.searchCompany, action),

            application: ApplicationReducer(rootStateChecked.application, action),
            applicationStatus: ApplicationStatusReducer(rootStateChecked.applicationStatus, action),

            selectCompany: selectCompanyReducer(rootStateChecked.selectCompany, action),
            
            // add new reducer here
            // ...
        }
        
        return afterStore;
    }

    return rootReducer;
}