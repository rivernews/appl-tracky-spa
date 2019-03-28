import createSagaMiddleware from 'redux-saga';
import { all } from "redux-saga/effects";
import { authLoginSaga, authLogoutSaga } from "./auth/sagas";
// rest api
import { companySagas } from "../store/company/company";
import { addressSagas } from "../store/address/address";

/** setup saga */
const sagaMiddleware = createSagaMiddleware();

export {
    sagaMiddleware
};

const rootSaga = function*() {
    yield all([
        authLoginSaga(),
        authLogoutSaga(),
        ...companySagas.map((saga) => saga()),
        ...addressSagas.map((saga) => saga()),
        // add new saga here
        // ...
    ]);
};

export const runSagaMiddleaware = () => {
    sagaMiddleware.run(rootSaga)
}

