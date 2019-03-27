import { takeEvery, call, put, all } from "redux-saga/effects";
import { RequestStatus, CrudMapToRest, RestApiService, } from "../utils/rest-api";

interface IApiCallInstruction {
    objectName: string;
}

interface INewStateUpdateInstruction {

}

const RESTAPIReduxFactory = (
    apiCallInstruction: IApiCallInstruction,
    newStateUpdateInstruction: INewStateUpdateInstruction
): any => {
    const { objectName } = apiCallInstruction;
    const asyncKeywords = Object.values(RequestStatus);
    const restfulKeywords = Object.keys(CrudMapToRest);

    /** action type names */
    type IObjectActionNames = {
        [restfulKeyword: string]: {
            [asyncKeyword: string]: string
        }
    }
    let ObjectActionNames: IObjectActionNames = {}
    for (let restfulKeyword of restfulKeywords) {
        ObjectActionNames[restfulKeyword] = {}
        for (let asyncKeyword of asyncKeywords) {
            ObjectActionNames[restfulKeyword][asyncKeyword] = `${asyncKeyword.toUpperCase()}_${restfulKeyword.toUpperCase()}_${objectName.toUpperCase()}`;
        }
    }

    /** create */

    // request
    type IRequestedCreateObjectState = {
        requestStatus: RequestStatus
    }
    // TODO: success

    // TODO: failure

    type IRequestedCreateObjectAction = {
        type: IObjectActionNames
        payload: IRequestedCreateObjectState
    }

    function* createObjectSagaHandler(
        requestedCreateObjectAction: IRequestedCreateObjectAction
    ) {
        // RequestAuth action triggered & injecting side effects here...
        const actionPayload = requestedCreateObjectAction.payload;
        try {
            // api call
            const jsonResponse = yield call(RestApiService.post, {
                data: actionPayload,
                objectName
            });

            // success state
            yield put(SuccessLoginAuth(jsonResponse.email, "", jsonResponse.token));
        } catch (error) {
            // error state
            yield put(FailureAuth(error));
            return;
        }
    }

    function* createObjectSaga() {
        yield takeEvery(
            ObjectActionNames.create.triggered,
            createObjectSagaHandler
        );
    }

    /** rest of the CRUD - create/read/list/update/delete */
};
