import { take, call, put } from 'redux-saga/effects';

import { AuthActionNames, IRequestedAuthAction } from "../../store/auth/types";
import { SuccessAuth, FailureAuth } from "../../store/auth/actions";

import { authentication } from "../../utils/auth";

export function* authSaga() {
    // RequestAuth action triggered & injecting side effects here...
    const requestedAuthAction: IRequestedAuthAction = yield take(AuthActionNames.REQUESTED_AUTH)
    const { socialAuthToken } = requestedAuthAction.payload;
    try {
        yield call(authentication.serverLogin, socialAuthToken);
    }
    catch (error) {
        yield put(FailureAuth(error));
        return;
    }

    yield put(SuccessAuth(authentication.state.userEmail, ""))
}