import createSagaMiddleware from 'redux-saga';
import { all } from "redux-saga/effects";
import { authLoginSaga, authLogoutSaga } from "./auth/sagas";
// rest api
import { CompanySagas } from "../store/data-model/company";
import { AddressSagas } from "../store/data-model/address";
import { ApplicationSagas } from "../store/data-model/application";
import { ApplicationStatusSagas } from "../store/data-model/application-status";
import { ApplicationStatusLinkSagas } from "../store/data-model/application-status-link";

/** setup saga */
const sagaMiddleware = createSagaMiddleware();

export {
    sagaMiddleware
};

const rootSaga = function*() {
    yield all([
        authLoginSaga(),
        authLogoutSaga(),
        ...CompanySagas.map((saga) => saga()),
        ...AddressSagas.map((saga) => saga()),
        ...ApplicationSagas.map((saga) => saga()),
        ...ApplicationStatusSagas.map((saga) => saga()),
        ...ApplicationStatusLinkSagas.map((saga) => saga()),
        // add new saga here
        // ...
    ]);
};

export const runSagaMiddleaware = () => {
    sagaMiddleware.run(rootSaga)
}

