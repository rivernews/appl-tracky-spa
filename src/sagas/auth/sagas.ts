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
// redux-saga
import { takeEvery, call, put } from "redux-saga/effects";

/** router */
import { push } from "connected-react-router";

/** api */
import { authentication } from "../../utils/auth";
import { RestApiService } from "../../utils/rest-api";

function* authLoginSagaHandler(
    requestedLoginAuthAction: IRequestedLoginAuthAction
) {
    // RequestAuth action triggered & injecting side effects here...
    console.log("auth saga: initialize");
    const { socialAuthToken } = requestedLoginAuthAction.payload;
    console.log("auth saga: request fired");
    try {
        // TODO: define interface typing for api response
        const jsonResponse = yield call(authentication.serverLogin, socialAuthToken);
        console.log("auth saga: navigating. jsonRes:", jsonResponse);
        authentication.state.apiLoginToken = RestApiService.state.apiLoginToken = jsonResponse.token;
        yield put(SuccessLoginAuth(jsonResponse.email, "", jsonResponse.token));
        // yield put(push("/home/"));
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
    console.log("auth logout saga: fired");
    try {
        yield call(authentication.serverLogout);
    } catch (error) {
        yield put(FailureAuth(error));
        return;
    }

    console.log("auth logout saga: navigating");
    yield put(SuccessLogoutAuth());
    // yield put(push("/"));
}

export function* authLogoutSaga() {
    yield takeEvery(
        AuthActionNames.REQUESTED_LOGOUT_AUTH,
        authLogoutSagaHandler
    );
}

// add new saga handler here && a `takeEvery` saga.
// ...