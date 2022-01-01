/** redux */
import {
    AuthActionNames,
    IRequestedLoginAuthAction,
    IRequestedLogoutAuthAction
} from "../types/auth-types";
import {
    SuccessLoginAuth,
    SuccessLogoutAuth,
    FailureAuth
} from "../action-creators/auth-actions";
import { resetAllStoreAction } from "../action-creators/root-actions";
// redux-saga
import { takeEvery, call, put } from "redux-saga/effects";

/** api */
import { AuthenticationService } from "../../utils/authentication";


function* authLoginSagaHandler(
    requestedLoginAuthAction: IRequestedLoginAuthAction
) {
    // RequestAuth action triggered & injecting side effects here...

    const {
        loginMode,
        params={},
        onCompleteCallback,
    } = requestedLoginAuthAction;

    try {
        // TODO: define interface typing for api response

        const jsonResponse = yield call(AuthenticationService.serverLogin, loginMode, params);

        // In prefill login case, if cannot restore/refresh login session
        if (!jsonResponse.token) {
            yield put(SuccessLogoutAuth());
            return;
        }

        yield put(SuccessLoginAuth(
            jsonResponse.email, "",
            jsonResponse.token,
            jsonResponse.refresh,
            jsonResponse.avatar_url,
            jsonResponse.isLocal
        ));
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
    try {
        yield call(AuthenticationService.serverLogout);

        // clear all store
    } catch (error) {
        yield put(FailureAuth(error));
        return;
    }

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