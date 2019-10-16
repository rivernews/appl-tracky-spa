/** redux */
import {
    AuthActionNames,
    IRequestedLoginAuthAction,
    IRequestedLogoutAuthAction
} from "../../store/auth/types";
import {
    SuccessLoginAuth,
    SuccessLogoutAuth,
    FailureAuth
} from "../../store/auth/actions";
import { resetAllStoreAction } from "../../store/actions";
import { CompanyActions, Company } from "../../store/data-model/company";
import { ApplicationActions, Application } from "../../store/data-model/application";
import { ApplicationStatusActions, ApplicationStatus } from "../../store/data-model/application-status";
// redux-saga
import { takeEvery, call, put } from "redux-saga/effects";

/** router */
import { push } from "connected-react-router";

/** api */
import { AuthenticationService } from "../../utils/authentication";
import { CrudType, RequestStatus } from "../../utils/rest-api";

function* authLoginSagaHandler(
    requestedLoginAuthAction: IRequestedLoginAuthAction
) {
    // RequestAuth action triggered & injecting side effects here...
    process.env.NODE_ENV === 'development' && console.log("auth saga: initialize");
    
    const {
        loginMode, 
        params={},
        onCompleteCallback
    } = requestedLoginAuthAction;
    
    try {
        // TODO: define interface typing for api response

        const jsonResponse = yield call(AuthenticationService.serverLogin, loginMode, params);

        process.env.NODE_ENV === 'development' && console.log("auth saga: server login, jsonRes=", jsonResponse);

        // In prefill login case, if cannot restore/refresh login session
        if (!jsonResponse.token) {
            yield put(SuccessLogoutAuth());
            return;
        }

        yield put(SuccessLoginAuth(
            jsonResponse.email, "", 
            jsonResponse.token, 
            jsonResponse.avatar_url,
            jsonResponse.isLocal
        ));

        // initial fetch user data
        yield put(ApplicationActions[CrudType.LIST][RequestStatus.TRIGGERED].action(new Application({})))
        yield put(CompanyActions[CrudType.LIST][RequestStatus.TRIGGERED].action(new Company({})))
        yield put(ApplicationStatusActions[CrudType.LIST][RequestStatus.TRIGGERED].action(new ApplicationStatus({})))
    } catch (error) {
        console.warn(`auth saga error: ${JSON.stringify(error)}`);
        yield put(FailureAuth(error));
    }

    onCompleteCallback && onCompleteCallback();
}

export function* authLoginSaga() {
    yield takeEvery(AuthActionNames.REQUESTED_LOGIN_AUTH, authLoginSagaHandler);
}

function* authLogoutSagaHandler(
    requestedLogoutAuthAction: IRequestedLogoutAuthAction
) {
    // RequestAuth action triggered & injecting side effects here...
    process.env.NODE_ENV === 'development' && console.log("auth logout saga: fired");
    try {
        yield call(AuthenticationService.serverLogout);

        // clear all store
    } catch (error) {
        yield put(FailureAuth(error));
        return;
    }

    process.env.NODE_ENV === 'development' && console.log("auth logout saga: navigating");
    yield put(SuccessLogoutAuth());
    // yield put(push("/"));

    // clear all redux store
    yield put(resetAllStoreAction());
}

export function* authLogoutSaga() {
    yield takeEvery(
        AuthActionNames.REQUESTED_LOGOUT_AUTH,
        authLogoutSagaHandler
    );
}

// add new saga handler here && a `takeEvery` saga.
// ...