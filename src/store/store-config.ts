/** redux */
import { createStore, applyMiddleware, compose } from "redux";
import { IRootState } from "../store/types";
import { createRootReducer } from "../store/reducers";

/** router */
import { createBrowserHistory } from 'history';
import { routerMiddleware } from 'connected-react-router';

/** middleware */
// saga
import { sagaMiddleware, runSagaMiddleaware } from "../sagas/saga-config";



const history = createBrowserHistory({
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
    preloadedState,
    compose(
        applyMiddleware(
            routerMiddleware(history),
            sagaMiddleware,
            // ... add other middlewares ...
        )
    )
);

/** after mount saga middlewares to store, run them */
runSagaMiddleaware();

export {
    history
};