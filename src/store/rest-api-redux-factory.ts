import { takeEvery, call, put, all } from "redux-saga/effects";
import {
    RequestStatus,
    CrudMapToRest,
    RestApiService
} from "../utils/rest-api";

interface IApiCallInstruction {
    objectName: string;
    schema: {
        [fieldName: string]: any;
        id: string;
    };
}

interface INewStateUpdateInstruction {}

interface IObjectRestApiRedux {
    [restfulKeyword: string]: {
        [asyncKeyword: string]: {
            actionTypeName: string;
            state: any;
            action: Function;
        };
    };
}

const RESTAPIReduxFactory = (
    apiCallInstruction: IApiCallInstruction,
    newStateUpdateInstruction: INewStateUpdateInstruction
): any => {
    const { objectName } = apiCallInstruction;
    const asyncKeywords = Object.values(RequestStatus);
    const crudKeywords = Object.keys(CrudMapToRest);

    let ObjectRestApiRedux: IObjectRestApiRedux = {};
    for (let crudKeyword of crudKeywords) {
        ObjectRestApiRedux[crudKeyword] = {};
        /** store */
        // TODO?: action state

        /** action */
        // action type names
        for (let requestStatus of Object.values(RequestStatus)) {
            ObjectRestApiRedux[crudKeyword][
                requestStatus
            ].actionTypeName = `${requestStatus.toUpperCase()}_${crudKeyword.toUpperCase()}_${objectName.toUpperCase()}`;
        }

        // async actions ( & state...)
        ObjectRestApiRedux[crudKeyword][
            RequestStatus.TRIGGERED
        ].action = (/** data needed for api call */) => {
            return {
                type:
                    ObjectRestApiRedux[crudKeyword][RequestStatus.TRIGGERED]
                        .actionTypeName,
                payload: {
                    requestStatus: RequestStatus.TRIGGERED
                    // TODO: things to pass to saga => api call
                }
            };
        };
        ObjectRestApiRedux[crudKeyword][
            RequestStatus.REQUESTING
        ].action = () => {
            return {
                type:
                    ObjectRestApiRedux[crudKeyword][RequestStatus.REQUESTING]
                        .actionTypeName,
                payload: {
                    requestStatus: RequestStatus.REQUESTING
                }
            };
        };
        ObjectRestApiRedux[crudKeyword][
            RequestStatus.SUCCESS
        ].action = (/** api response */) => {
            return {
                type:
                    ObjectRestApiRedux[crudKeyword][RequestStatus.SUCCESS]
                        .actionTypeName,
                payload: {
                    requestStatus: RequestStatus.SUCCESS
                    // TODO: things got from api response, and needs to update to redux
                }
            };
        };
        ObjectRestApiRedux[crudKeyword][RequestStatus.FAILURE].action = (
            error: any
        ) => {
            return {
                type:
                    ObjectRestApiRedux[crudKeyword][RequestStatus.FAILURE]
                        .actionTypeName,
                payload: {
                    requestStatus: RequestStatus.FAILURE,
                    error
                }
            };
        };

        // TODO: action typing

        /** saga */
        const sagaHandlerKey = `${crudKeyword}${objectName}SagaHandler`;
        const sagaHandler = {
            // TODO: action typing
            *[sagaHandlerKey](triggerAction: any) {
                // TODO: saga
                const actionPayload = triggerAction.payload;
                yield put(ObjectRestApiRedux[crudKeyword][
                    RequestStatus.REQUESTING
                ].action())
                try {
                    // api call
                    const jsonResponse = yield call(RestApiService[CrudMapToRest[crudKeyword]], {
                        data: actionPayload,
                        objectName
                    });

                    // success state
                    yield put(
                        ObjectRestApiRedux[crudKeyword][
                            RequestStatus.SUCCESS
                        ].action(SuccessCreateObjectState) // TODO
                    );
                } catch (error) {
                    // error state
                    yield put(ObjectRestApiRedux[crudKeyword][
                        RequestStatus.FAILURE
                    ].action(error));
                    return;
                }
            }
        };

        const saga = {
            *[`${crudKeyword}${objectName}Saga`]() {
                yield takeEvery(
                    ObjectRestApiRedux[crudKeyword][RequestStatus.TRIGGERED]
                        .actionTypeName,
                    sagaHandler[sagaHandlerKey]
                );
            }
        };
    }

    /** rest of the CRUD - create/read/list/update/delete */
};
