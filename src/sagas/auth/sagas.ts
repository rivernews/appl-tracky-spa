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
import { RestApiService, CrudType, RequestStatus } from "../../utils/rest-api";

function* authLoginSagaHandler(
    requestedLoginAuthAction: IRequestedLoginAuthAction
) {
    // RequestAuth action triggered & injecting side effects here...
    process.env.NODE_ENV === 'development' && console.log("auth saga: initialize");
    const { socialAuthToken } = requestedLoginAuthAction.payload;
    process.env.NODE_ENV === 'development' && console.log("auth saga: request fired");

    // Try to fetch auth state from localStorage, if token not provided
    if (socialAuthToken === '') {
        // restore auth state
        const sessionAuthState = sessionStorage.getItem('authState') ? JSON.parse(sessionStorage.getItem('authState') || '{}') : {};
        
        if (sessionAuthState.isLogin) {
            AuthenticationService.apiCallToken = sessionAuthState.apiToken;

            yield put(SuccessLoginAuth(
                sessionAuthState.userName, "",
                sessionAuthState.apiToken,
                sessionAuthState.avatarUrl,
                false
            ));
            
            // initial fetch user data
            yield put(ApplicationActions[CrudType.LIST][RequestStatus.TRIGGERED].action(new Application({})))
            yield put(CompanyActions[CrudType.LIST][RequestStatus.TRIGGERED].action(new Company({})))
            yield put(ApplicationStatusActions[CrudType.LIST][RequestStatus.TRIGGERED].action(new ApplicationStatus({})))

            return;
        }
        
        // localStorage auth state cannot be used for login
        yield put(SuccessLogoutAuth());
        sessionStorage.removeItem('authState');
        return;
    }
    
    try {
        // TODO: define interface typing for api response
        const jsonResponse = yield call(AuthenticationService.serverLogin, socialAuthToken);
        process.env.NODE_ENV === 'development' && console.log("auth saga: server login using code from social button. server jsonRes=", jsonResponse);
        
        AuthenticationService.apiCallToken = jsonResponse.token;
        yield put(SuccessLoginAuth(
            jsonResponse.email, "", 
            jsonResponse.token, 
            jsonResponse.avatar_url,
            false // is not local login, is social login
        ));

        // initial fetch user data
        yield put(ApplicationActions[CrudType.LIST][RequestStatus.TRIGGERED].action(new Application({})))
        yield put(CompanyActions[CrudType.LIST][RequestStatus.TRIGGERED].action(new Company({})))
        yield put(ApplicationStatusActions[CrudType.LIST][RequestStatus.TRIGGERED].action(new ApplicationStatus({})))
    } catch (error) {
        console.warn("auth saga: error")
        yield put(FailureAuth(error));
        return;
    }
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