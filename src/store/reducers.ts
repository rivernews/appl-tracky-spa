/** redux */
import { Reducer, Action } from "redux";
import { connectRouter, LocationChangeAction } from 'connected-react-router';
import { authReducer } from "./auth/reducers";
import { IRootState } from "./types";
import { IObjectStore } from "./rest-api-redux-factory";
import { RootActionNames } from "./actions";
// rest api
import { CompanyReducer, GroupedCompanyRestApiRedux, labelTypesMapToCompanyGroupTypes, companyGroupTypes, Company } from "./data-model/company";
import { ApplicationReducer } from "./data-model/application";
import { ApplicationStatusReducer } from "./data-model/application-status";

/** router */
import { History } from "history";


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

        let rootStateChecked: any = {}
        if (!rootState) {
            rootStateChecked.router = undefined;
            rootStateChecked.auth = undefined;

            rootStateChecked.company = undefined;
            Object.values(labelTypesMapToCompanyGroupTypes).forEach((companyGroupText) => {
                rootStateChecked[companyGroupText] = undefined;
            });

            rootStateChecked.application = undefined;
            rootStateChecked.applicationStatus = undefined;
            // add initial state for new sub-store here
            // ...
        } else if (action.type === RootActionNames.ResetAllStore) {
            rootStateChecked = {
                router: rootState.router
            }
        } else {
            rootStateChecked = rootState;
        }

        process.env.NODE_ENV === 'development' && console.log("beforeRootStore", rootState);
        process.env.NODE_ENV === 'development' && console.log("reducer: incoming action", action);

        const afterStore = { 
            ...rootState,
            router: connectRouter(history)(rootStateChecked.router, action as LocationChangeAction),
            auth: authReducer(rootStateChecked.auth, action),

            company: CompanyReducer(rootStateChecked.company, action),
            ...(Object.values(labelTypesMapToCompanyGroupTypes).reduce((accumulated, companyGroupText) => {
                return {
                    ...accumulated,
                    [companyGroupText]: GroupedCompanyRestApiRedux[companyGroupText].storeReducer(rootStateChecked[companyGroupText], action)
                }
            }, {}) as {[key in companyGroupTypes]: IObjectStore<Company> }),

            application: ApplicationReducer(rootStateChecked.application, action),
            applicationStatus: ApplicationStatusReducer(rootStateChecked.applicationStatus, action),
            // add new reducer here
            // ...
        }
        process.env.NODE_ENV === 'development' && console.log("afterRootStore", afterStore);

        return afterStore;
    }

    return rootReducer;
}