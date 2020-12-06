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
import { resetAllStoreAction, GroupedCompanyActionCreators } from "../action-creators/root-actions";
import { labelTypesMapToCompanyGroupTypes } from "../../data-model/company/company";
import { labelTypes } from "../../data-model/label";
// redux-saga
import { takeEvery, call, put } from "redux-saga/effects";

/** api */
import { AuthenticationService } from "../../utils/authentication";
import { CrudType, RequestStatus, RestApiService } from "../../utils/rest-api";


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
            jsonResponse.avatar_url,
            jsonResponse.isLocal
        ));

        // initial fetch user data
        // yield put(
        //     CompanyActionCreators[CrudType.LIST][RequestStatus.TRIGGERED].action()
        // );

        // fetch companies that do not have label status yet, treat them as `target` and put them in target group
        yield put(
            GroupedCompanyActionCreators["targetCompany"][CrudType.LIST][RequestStatus.TRIGGERED].action(
                {}, undefined, undefined, undefined,
                `${RestApiService.state.apiBaseUrl}companies/?labels__isnull=True`
            )
        );
        // fetch companies filter by their label status
        for (let labelText of Object.values(labelTypes)) {
            yield put(
                GroupedCompanyActionCreators[labelTypesMapToCompanyGroupTypes[labelText as labelTypes]][CrudType.LIST][RequestStatus.TRIGGERED].action(
                    {}, undefined, undefined, undefined,
                    `${RestApiService.state.apiBaseUrl}companies/?labels__text=${labelText}`
                )
            )
        }
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