/** redux */
import { createStore, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension/developmentOnly";
import { IRootState } from "../types/root-types";
import { createRootReducer } from "../reducers/root-reducers";

/** router */
import { createBrowserHistory } from 'history';
import { routerMiddleware } from 'connected-react-router';

/** middleware */
// saga
import { sagaMiddleware, runSagaMiddleaware } from "../sagas/root-saga";


export const history = createBrowserHistory({
    basename: (process.env.NODE_ENV === 'development') ?
    ``
    :
    // since we use custom domain which has root dir of /
    // we no longer need a base subpath
    // the subpath is originally used for github page
    ``
    // `/appl-tracky-spa`
});

const preloadedState = {

};

// generate the singleton store from redux
export const store = createStore<IRootState, any, any, any>(
    createRootReducer(history),
    preloadedState as any,

    // for redux debugging (only enabled in development)
    // https://extension.remotedev.io/#usage
    composeWithDevTools(
        applyMiddleware(
            routerMiddleware(history),
            sagaMiddleware,
            // ... add other middlewares ...
        )
    )
);

/** after mount saga middlewares to store, run them */
runSagaMiddleaware();

export const getCompanyStore = (store: IRootState) => store.company;
export const getApplicationStore = (store: IRootState) => store.application;