import createSagaMiddleware from 'redux-saga';
import { all } from "redux-saga/effects";
import { authLoginSaga, authLogoutSaga } from "./auth/sagas";
// rest api
import { CompanySagas,
    targetCompanyRestApiRedux,
    appliedCompanyRestApiRedux,
    interviewingCompanyRestApiRedux,
    archivedCompanyRestApiRedux
} from "../store/data-model/company";
import { ApplicationSagas } from "../store/data-model/application";
import { ApplicationStatusSagas } from "../store/data-model/application-status";

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
        ...targetCompanyRestApiRedux.sagas.map((saga) => saga()),
        ...appliedCompanyRestApiRedux.sagas.map((saga) => saga()),
        ...interviewingCompanyRestApiRedux.sagas.map((saga) => saga()),
        ...archivedCompanyRestApiRedux.sagas.map((saga) => saga()),

        ...ApplicationSagas.map((saga) => saga()),
        ...ApplicationStatusSagas.map((saga) => saga()),
        // add new saga here
        // ...
    ]);
};

export const runSagaMiddleaware = () => {
    sagaMiddleware.run(rootSaga)
}

