/** redux */
import { combineReducers, Reducer, AnyAction, Action } from "redux";
import { connectRouter, LocationChangeAction } from 'connected-react-router';
import { authReducer } from "./auth/reducers";
import { TAuthActions } from "./auth/types";
import { IRootState } from "./types";
// rest api
import { CompanyReducer } from "./data-model/company";
import { AddressReducer } from "./data-model/address";
import { ApplicationReducer } from "./data-model/application";

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

    const rootReducer: Reducer<IRootState> = (rootState: IRootState | undefined, incomingAction: Action): IRootState  => {
        const action = incomingAction as LocationChangeAction

        let rootStateChecked: any = {}
        if (!rootState) {
            rootStateChecked.router = undefined;
            rootStateChecked.auth = undefined;
            rootStateChecked.company = undefined;
            rootStateChecked.address = undefined;
            rootStateChecked.application = undefined;
        } else {
            rootStateChecked = rootState;
        }

        return {
            ...rootState,
            router: connectRouter(history)(rootStateChecked.router, action),
            auth: authReducer(rootStateChecked.auth, action),
            company: CompanyReducer(rootStateChecked.company, action),
            address: AddressReducer(rootStateChecked.address, action),
            application: ApplicationReducer(rootStateChecked.application, action),
        }
    }

    return rootReducer;
}