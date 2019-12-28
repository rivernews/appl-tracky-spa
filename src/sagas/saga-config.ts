import createSagaMiddleware from 'redux-saga';
import { all } from "redux-saga/effects";
import { authLoginSaga, authLogoutSaga } from "./auth/sagas";
// rest api
import { CompanySagas, GroupedCompanyRestApiRedux, labelTypesMapToCompanyGroupTypes} from "../store/data-model/company";
import { labelTypes } from '../store/data-model/label';
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
        ...Object.values(labelTypes).map(labelText => {
            console.log('mmmy test', labelText);

            return GroupedCompanyRestApiRedux[labelTypesMapToCompanyGroupTypes[labelText as labelTypes]].sagas.map(saga => saga())
        }).flat(),

        ...ApplicationSagas.map((saga) => saga()),
        ...ApplicationStatusSagas.map((saga) => saga()),
        // add new saga here
        // ...
    ]);
};

export const runSagaMiddleaware = () => {
    sagaMiddleware.run(rootSaga)
}

