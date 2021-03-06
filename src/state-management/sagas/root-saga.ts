import createSagaMiddleware, { SagaIterator } from 'redux-saga';
import { all } from "redux-saga/effects";
import { authLoginSaga, authLogoutSaga } from "./auth-sagas";
// rest api
import { companyGroupTypes, companyGroups} from "../../data-model/company/company";
import { RestApiSagaFactory } from './saga-factory';
import { CompanyActionCreators, ApplicationActionCreators, ApplicationStatusActionCreators, GroupedCompanyActionCreators, SearchCompanyActionCreators } from '../action-creators/root-actions';
import { companyDoneUpdateSuccessSagaHandler, groupedCompanyListSuccessSagaHandler, searchCompanyListSuccessSagaHandler, companyOverrideDeleteSuccessSagaHandler } from './company-custom-saga';
import { CompanyNormalizeManifest } from '../../data-model/company/company-normalize-schema';
import { applicationDoneCreateSuccessSagaHandler, applicationDoneDeleteSuccessSagaHandler } from './applicaiton-custom-saga';
import { ApplicationNormalizeManifest } from '../../data-model/application/application-normalize-schema';
import { applicationStatusDoneCreateSuccessSagaHandler, applicationStatusDoneDeleteSuccessSagaHandler } from './application-status-custom-saga';
import { selectCompanyApplySaga } from './select-company-saga';


// saga for company
export const CompanySagas = RestApiSagaFactory("companies", CompanyActionCreators, {
    doneCrudSuccessSagaHandler: {
        update: companyDoneUpdateSuccessSagaHandler,
    },
    overrideCrudSuccessSagaHandler: {
        delete: companyOverrideDeleteSuccessSagaHandler
    },
    normalizeManifest: CompanyNormalizeManifest
})

export const GroupCompanySagas = companyGroups.reduce((accumulated, companyGroupText) => {
    return {
        ...accumulated,
        [companyGroupText]: RestApiSagaFactory(companyGroupText, GroupedCompanyActionCreators[companyGroupText], {
            overrideCrudSuccessSagaHandler: {
                list: groupedCompanyListSuccessSagaHandler
            },
            normalizeManifest: CompanyNormalizeManifest
        })
    }
}, {}) as {
    [groupText in companyGroupTypes]: Array<() => SagaIterator>
};

export const SearchCompanySagas = RestApiSagaFactory("searchCompany", SearchCompanyActionCreators, {
    overrideCrudSuccessSagaHandler: {
        list: searchCompanyListSuccessSagaHandler
    },
    normalizeManifest: CompanyNormalizeManifest
})


// saga for application
export const ApplicationSagas = RestApiSagaFactory("applications", ApplicationActionCreators, {
    doneCrudSuccessSagaHandler: {
        create: applicationDoneCreateSuccessSagaHandler,
        delete: applicationDoneDeleteSuccessSagaHandler
    },
    normalizeManifest: ApplicationNormalizeManifest
});


// saga for statuses
export const ApplicationStatusSagas = RestApiSagaFactory("application-statuses", ApplicationStatusActionCreators, {
    doneCrudSuccessSagaHandler: {
        create: applicationStatusDoneCreateSuccessSagaHandler,
        delete: applicationStatusDoneDeleteSuccessSagaHandler
    }
});


// collect all sagas in root saga

const rootSaga = function*() {
    yield all([
        authLoginSaga(),
        authLogoutSaga(),

        ...CompanySagas.map((saga) => saga()),
        ...companyGroups.map(companyGroupText => {
            return GroupCompanySagas[companyGroupText].map(saga => saga())
        }).flat(),
        ...SearchCompanySagas.map((saga) => saga()),

        ...ApplicationSagas.map((saga) => saga()),
        ...ApplicationStatusSagas.map((saga) => saga()),

        selectCompanyApplySaga(),

        // add new saga here
        // ...
    ]);
};


/** setup saga */
export const sagaMiddleware = createSagaMiddleware();


export const runSagaMiddleaware = () => {
    sagaMiddleware.run(rootSaga)
}
