import { takeEvery, call, put, all } from "redux-saga/effects";

interface IApiCallInstruction {
    objectName: string;
}

interface InewStateUpdateInstruction {}

const RESTAPIReduxFactory = (
    apiCallInstruction: IApiCallInstruction,
    newStateUpdateInstruction: any
): any => {
    const { objectName } = apiCallInstruction;
    const asyncKeywords = ['trigger','requested', 'success', 'failure'];
    const restfulKeywords = ['create','read', 'list', 'update', 'delete'];

    let ObjectActionNames: any = {}
    for (let restfulKeyword of restfulKeywords) {
        ObjectActionNames[restfulKeyword] = {}
        for (let asyncKeyword of asyncKeywords) {
            ObjectActionNames[restfulKeyword][asyncKeyword] = `${asyncKeyword.toUpperCase()}_${restfulKeyword.toUpperCase()}_${objectName.toUpperCase()}`;
        }
    }

    /** create */

    function* createObjectSagaHandler(
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
            yield put(SuccessLoginAuth(jsonResponse.email, "", jsonResponse.token));
            // yield put(push("/home/"));
        } catch (error) {
            console.warn("auth saga: error")
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
