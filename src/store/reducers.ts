/** redux */
import { combineReducers, Reducer, AnyAction, Action } from "redux";
import { connectRouter, LocationChangeAction } from 'connected-react-router';
import { authReducer } from "./auth/reducers";
import { TAuthActions } from "./auth/types";
import { IRootState } from "./types";
import { RootActionNames } from "./actions";
// rest api
import { CompanyReducer } from "./data-model/company";
import { AddressReducer } from "./data-model/address";
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
            rootStateChecked.address = undefined;
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

        console.log("beforeRootStore", rootState);

        const afterStore  = { 
            ...rootState,
            router: connectRouter(history)(rootStateChecked.router, action as LocationChangeAction),
            auth: authReducer(rootStateChecked.auth, action),
            company: CompanyReducer(rootStateChecked.company, action),
            address: AddressReducer(rootStateChecked.address, action),
            application: ApplicationReducer(rootStateChecked.application, action),
            applicationStatus: ApplicationStatusReducer(rootStateChecked.applicationStatus, action),
            // add new reducer here
            // ...
        }
        console.log("afterRootStore", afterStore);

        return afterStore;
    }

    return rootReducer;
}