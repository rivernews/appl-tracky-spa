import { takeEvery, call, put, all } from "redux-saga/effects";
import {
    RequestStatus,
    CrudType,
    RestMethod,
    CrudMapToRest,
    RestApiService,
    ISingleRestApiResponse,
    IListRestApiResponse
} from "../utils/rest-api";
import omit from "lodash/omit";

export interface IObject {
    uuid: string
    [fieldName: string]: any
}

interface IObjectRestApiAction {
    [restfulKeyword: string]: {
        [asyncKeyword: string]: {
            actionTypeName: string;
            action: Function;
        };
    };
}

interface IObjectAction {
    type: string
    crudType: CrudType
    payload: {
        requestStatus: RequestStatus
        formData?: IObject | Array<IObject>
        error?: any
    }
}

interface IObjectStore {
    objectList: {
        [uuid: string]: IObject
    }
    requestStatus: RequestStatus
    error?: any
}

const RestApiReduxFactory: (
    objectName: string
) => {
    actions: IObjectRestApiAction;
    reducer: (objectStore: IObjectStore, action: IObjectAction) => IObjectStore;
} = function(objectName) {
    const crudKeywords = Object.values(CrudType);

    let ObjectRestApiRedux: IObjectRestApiAction = {};
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
        ObjectRestApiRedux[crudKeyword][RequestStatus.TRIGGERED].action = (
            /** data needed for api call */ objectClassInstance: any
        ): IObjectAction => {
            // TODO: typing check
            return {
                type:
                    ObjectRestApiRedux[crudKeyword][RequestStatus.TRIGGERED]
                        .actionTypeName,
                crudType: crudKeyword,
                payload: {
                    requestStatus: RequestStatus.TRIGGERED,
                    formData: objectClassInstance
                }
            };
        };
        ObjectRestApiRedux[crudKeyword][
            RequestStatus.REQUESTING
        ].action = (): IObjectAction => {
            return {
                type:
                    ObjectRestApiRedux[crudKeyword][RequestStatus.REQUESTING]
                        .actionTypeName,
                crudType: crudKeyword,
                payload: {
                    requestStatus: RequestStatus.REQUESTING
                }
            };
        };
        ObjectRestApiRedux[crudKeyword][RequestStatus.SUCCESS].action = (
            /** api response */ jsonResponse:
                | IListRestApiResponse
                | ISingleRestApiResponse
        ): IObjectAction => {
            
            let newState = {
                type:
                    ObjectRestApiRedux[crudKeyword][RequestStatus.SUCCESS]
                        .actionTypeName,
                crudType: crudKeyword,
            }
            if ((<ISingleRestApiResponse>jsonResponse).uuid) {
                return {
                    ...newState,
                    payload: {
                        requestStatus: RequestStatus.SUCCESS,
                        formData: (<ISingleRestApiResponse>jsonResponse)
                    }
                }
            } else if ((<IListRestApiResponse>jsonResponse).results) {
                return {
                    ...newState,
                    payload: {
                        requestStatus: RequestStatus.SUCCESS,
                        formData: (<IListRestApiResponse>jsonResponse).results
                    }
                } 
            }

            return {
                ...newState,
                payload: {
                    requestStatus: RequestStatus.SUCCESS,
                    formData: undefined // TODO: what't this?
                }
            }
        };
        ObjectRestApiRedux[crudKeyword][RequestStatus.FAILURE].action = (
            error: any
        ): IObjectAction => {
            return {
                type:
                    ObjectRestApiRedux[crudKeyword][RequestStatus.FAILURE]
                        .actionTypeName,
                crudType: crudKeyword,
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
            *[sagaHandlerKey](triggerAction: IObjectAction) {
                const formData = triggerAction.payload.formData;
                yield put(
                    ObjectRestApiRedux[crudKeyword][
                        RequestStatus.REQUESTING
                    ].action()
                );
                try {
                    // api call
                    const jsonResponse:
                        | IListRestApiResponse
                        | ISingleRestApiResponse = yield call(
                        RestApiService[CrudMapToRest(crudKeyword)],
                        {
                            data: formData,
                            objectName
                        }
                    );

                    // success state
                    yield put(
                        ObjectRestApiRedux[crudKeyword][
                            RequestStatus.SUCCESS
                        ].action(jsonResponse)
                    );
                } catch (error) {
                    // error state
                    yield put(
                        ObjectRestApiRedux[crudKeyword][
                            RequestStatus.FAILURE
                        ].action(error)
                    );
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

    // TODO: store type
    const initialState: IObjectStore = {
        objectList: {},
        requestStatus: RequestStatus.SUCCESS,
    };

    // TODO: store type
    // TODO: action type
    function reducer(objectStore = initialState, action: IObjectAction): IObjectStore {
        // async success
        if (action.payload.requestStatus === RequestStatus.SUCCESS) {
            // CREATE
            if (action.crudType === CrudType.CREATE) {
                let newObject = (<IObject>action.payload.formData);
                return {
                    objectList: {
                        ...objectStore.objectList,
                        [newObject.uuid]: newObject
                    },
                    requestStatus: action.payload.requestStatus
                };
            }

            // LIST
            else if (action.crudType === CrudType.LIST) {
                const resObjectList = (<Array<IObject>>action.payload.formData);
                let newObjectList: { [uuid: string]: IObject } = {};
                for (let object of resObjectList) {
                    newObjectList[object.uuid] = object;
                }
                return {
                    objectList: {
                        ...objectStore.objectList,
                        ...newObjectList
                    },
                    requestStatus: action.payload.requestStatus
                };
            }

            // UPDATE
            else if (action.crudType === CrudType.UPDATE) {
                let newObject = (<IObject>action.payload.formData);
                return {
                    objectList: {
                        ...objectStore.objectList,
                        [newObject.uuid]: newObject
                    },
                    requestStatus: action.payload.requestStatus
                };
            }

            // DELETE
            else if (action.crudType === CrudType.DELETE) {
                let newObject = (<IObject>action.payload.formData);
                return {
                    objectList: omit(objectStore.objectList, [newObject.uuid]),
                    requestStatus: action.payload.requestStatus
                }
            }
        }

        // async trigger
        else if (action.payload.requestStatus === RequestStatus.TRIGGERED) {
            return {
                ...objectStore,
                requestStatus: action.payload.requestStatus
            }
        }

        // async requesting & failure
        else {
            return {
                ...objectStore,
                ...action.payload
            }
        }

        // no effect
        return {
            ...objectStore
        }
    }

    return {
        actions: ObjectRestApiRedux,
        reducer
    };
};
