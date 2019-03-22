/** redux */
import { AuthActionNames, IRequestedLoginAuthAction, IRequestedLogoutAuthAction } from "../../store/auth/types";
import { SuccessLoginAuth, SuccessLogoutAuth, FailureAuth } from "../../store/auth/actions";
// redux-saga
import { takeEvery, call, put, all } from 'redux-saga/effects';

/** router */
import { push } from 'connected-react-router';

/** api */
import { authentication } from "../../utils/auth";




function* authLoginSagaHandler(requestedLoginAuthAction: IRequestedLoginAuthAction) {
    // RequestAuth action triggered & injecting side effects here...
    console.log('auth saga: initialize');
    const { socialAuthToken } = requestedLoginAuthAction.payload;
    console.log('auth saga: request fired')
    try {
        yield call(authentication.serverLogin, socialAuthToken);
    }
    catch (error) {
        yield put(FailureAuth(error));
        return;
    }

    console.log('auth saga: navigating');
    yield put(SuccessLoginAuth(authentication.state.userEmail, ""));
    yield put(push("/home/"));
}

function* authLoginSaga() {
    yield takeEvery(AuthActionNames.REQUESTED_LOGIN_AUTH, authLoginSagaHandler);
}

function* authLogoutSagaHandler(requestedLogoutAuthAction: IRequestedLogoutAuthAction) {
    // RequestAuth action triggered & injecting side effects here...
    console.log('auth logout saga: fired');
    try {
        yield call(authentication.serverLogout);
    }
    catch (error) {
        yield put(FailureAuth(error));
        return;
    }

    console.log('auth logout saga: navigating');
    yield put(SuccessLogoutAuth());
    yield put(push("/"));
}

function* authLogoutSaga() {
    yield takeEvery(AuthActionNames.REQUESTED_LOGOUT_AUTH, authLogoutSagaHandler);
}

// add new saga handler here && a `takeEvery` saga.
// ...

export const rootSaga = function* () {
    yield all([
        authLoginSaga(),
        authLogoutSaga(),
        // add new saga here
        // ...
    ])
}