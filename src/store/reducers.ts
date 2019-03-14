import { combineReducers } from "redux";
import { authReducer } from "./auth/reducers";

export const RootReducer = combineReducers({
    auth: authReducer,
    
    // add more reducers here
    // ...
})