import { combineReducers } from "redux";

import { authReducer } from "./auth/reducers";

const rootReducer = combineReducers({
    auth: authReducer,
    // add more reducers here
})

export type AppState = ReturnType<typeof rootReducer>