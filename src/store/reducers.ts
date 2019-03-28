/** redux */
import { combineReducers } from "redux";
import { connectRouter } from 'connected-react-router';
import { authReducer } from "./auth/reducers";
// rest api
import { companyReducer } from "./company/company";
import { addressReducer } from "./address/address";

/** router */
import { History } from "history";


function undefinedWrapper(func: (store: any | undefined, action: any) => any) {
    return func
}

// root reducer with router state
export const createRootReducer = (history: History<any>) => combineReducers({
    router: connectRouter(history),

    // add more reducers here
    auth: authReducer,
    company: undefinedWrapper(companyReducer),
    address: undefinedWrapper(addressReducer),
    // ...
})