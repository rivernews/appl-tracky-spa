/** redux */
import { combineReducers } from "redux";
import { connectRouter } from 'connected-react-router';
import { authReducer } from "./auth/reducers";

/** router */
import { History } from "history";




// root reducer with router state
export const createRootReducer = (history: History<any>) => combineReducers({
    router: connectRouter(history),

    // add more reducers here
    auth: authReducer,
    // ...
})