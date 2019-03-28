import { takeEvery, call, put } from "redux-saga/effects";
import { SagaIterator } from "redux-saga";
import {
    RequestStatus,
    CrudType,
    CrudMapToRest,
    RestApiService,
    ISingleRestApiResponse,
    IListRestApiResponse,
    IsSingleRestApiResponseTypeGuard
} from "../utils/rest-api";
import omit from "lodash/omit";

/** state & store */

export interface IObjectBase {
    uuid: string;
}

export type TObject<Schema> = IObjectBase & { [Property in keyof Schema]: Schema[Property] };

interface IObjectList<Schema> {
    [uuid: string]: TObject<Schema>;
}

export interface IObjectStore<Schema> {
    objectList: IObjectList<Schema>;
    lastChangedObjectID?: string;
    requestStatus: RequestStatus;
    error?: any;
}

/** action */

type IObjectRestApiAction = {
    [restfulKeyword: string]: {
        [asyncKeyword: string]: {
            actionTypeName: string;
            action: Function;
            saga?: () => SagaIterator;
        };
    };
};

export interface IObjectAction<Schema> {
    type: string;
    crudType: CrudType;
    callback?: Function;
    payload: {
        formData?: TObject<Schema> | Array<TObject<Schema>>;
        lastChangedObjectID?: string;
        requestStatus: RequestStatus;
        error?: any;
    };
}

/** factory API */

interface IRestApiReduxFactory<Schema> {
    actions: IObjectRestApiAction;
    storeReducer: (
        objectStore: IObjectStore<Schema>,
        action: IObjectAction<Schema>
    ) => IObjectStore<Schema>;
    sagas: Array<() => SagaIterator>;
}

export const RestApiReduxFactory = <Schema extends IObjectBase>(
    /** should have uuid */ objectName: string,
    initialObjectInstance: TObject<Schema>
): IRestApiReduxFactory<Schema> => {
    type TObjectSchema = typeof initialObjectInstance;
    const crudKeywords = Object.values(CrudType);

    let ObjectRestApiRedux: IObjectRestApiAction = {};
    for (let crudKeyword of crudKeywords) {
        ObjectRestApiRedux[crudKeyword] = {};
        /** store */
        // TODO?: action state

        /** action */
        // action type names
        for (let requestStatus of Object.values(RequestStatus)) {
            ObjectRestApiRedux[crudKeyword][requestStatus] = {
                actionTypeName: "",
                action: () => {}
            };
            ObjectRestApiRedux[crudKeyword][
                requestStatus
            ].actionTypeName = `${requestStatus.toUpperCase()}_${crudKeyword.toUpperCase()}_${objectName.toUpperCase()}`;
        }

        // async actions ( & state...)
        ObjectRestApiRedux[crudKeyword][RequestStatus.TRIGGERED].action = (
            objectClassInstance: TObjectSchema,
            callback?: Function
        ): IObjectAction<TObjectSchema> => {
            console.log(`action:fired, trigger, ${crudKeyword}`);
            return {
                type:
                    ObjectRestApiRedux[crudKeyword][RequestStatus.TRIGGERED]
                        .actionTypeName,
                crudType: crudKeyword,
                callback: callback,
                payload: {
                    requestStatus: RequestStatus.TRIGGERED,
                    formData: objectClassInstance
                }
            };
        };
        ObjectRestApiRedux[crudKeyword][
            RequestStatus.REQUESTING
        ].action = (): IObjectAction<TObjectSchema> => {
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
                | IListRestApiResponse<TObjectSchema>
                | ISingleRestApiResponse<TObjectSchema>
        ): IObjectAction<TObjectSchema> => {
            let newState = {
                type:
                    ObjectRestApiRedux[crudKeyword][RequestStatus.SUCCESS]
                        .actionTypeName,
                crudType: crudKeyword
            };
            // if is delete success, we don't need formData (& the server responds nothing for DELETE as well)
            if (crudKeyword === CrudType.DELETE) {
                return {
                    ...newState,
                    payload: {
                        requestStatus: RequestStatus.SUCCESS,
                    }
                }
            }
            else if (IsSingleRestApiResponseTypeGuard(jsonResponse)) {
                return {
                    ...newState,
                    payload: {
                        requestStatus: RequestStatus.SUCCESS,
                        formData: <ISingleRestApiResponse<TObjectSchema>>(
                            jsonResponse
                        ),
                        lastChangedObjectID: jsonResponse.uuid
                    }
                };
            } else {
                return {
                    ...newState,
                    payload: {
                        requestStatus: RequestStatus.SUCCESS,
                        formData: (<IListRestApiResponse<TObjectSchema>>(
                            jsonResponse
                        )).results
                    }
                };
            }
        };
        ObjectRestApiRedux[crudKeyword][RequestStatus.FAILURE].action = (
            error: any
        ): IObjectAction<TObjectSchema> => {
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

        /** saga */
        const sagaHandler = function*(
            triggerAction: IObjectAction<TObjectSchema>
        ) {
            console.log(`Saga: action intercepted; aync=trigger, crud=${crudKeyword}, obj=${objectName}; ready to call api`);
            const formData = triggerAction.payload.formData;
            yield put(
                ObjectRestApiRedux[crudKeyword][
                    RequestStatus.REQUESTING
                ].action()
            );
            try {
                // api call
                const jsonResponse:
                    | IListRestApiResponse<TObjectSchema>
                    | ISingleRestApiResponse<TObjectSchema> = yield call(
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

                if (triggerAction.callback) {
                    triggerAction.callback();
                }
            } catch (error) {
                // error state
                yield put(
                    ObjectRestApiRedux[crudKeyword][
                        RequestStatus.FAILURE
                    ].action(error)
                );
                return;
            }
        };

        ObjectRestApiRedux[crudKeyword][
            RequestStatus.TRIGGERED
        ].saga = function*() {
            console.log(`Saga: action intercepted; async=trigger, crud=${crudKeyword}, obj=${objectName}`);
            yield takeEvery(
                ObjectRestApiRedux[crudKeyword][RequestStatus.TRIGGERED]
                    .actionTypeName,
                sagaHandler
            );
        };
    }

    const initialState: IObjectStore<TObjectSchema> = {
        objectList: {},
        requestStatus: RequestStatus.SUCCESS
    };

    const storeReducer = (
        objectStore: IObjectStore<TObjectSchema> | undefined = initialState,
        action: IObjectAction<TObjectSchema>
    ): IObjectStore<TObjectSchema> => {
        if (!(action && action.payload && action.payload.requestStatus)) {
            return {
                ...objectStore
            };
        }

        // async success
        if (action.payload.requestStatus === RequestStatus.SUCCESS) {
            // CREATE
            if (action.crudType === CrudType.CREATE) {
                let newObject = <TObject<TObjectSchema>>action.payload.formData;
                return {
                    objectList: {
                        ...objectStore.objectList,
                        [newObject.uuid]: newObject
                    },
                    requestStatus: action.payload.requestStatus,
                    lastChangedObjectID: action.payload.lastChangedObjectID
                };
            }

            // LIST
            else if (action.crudType === CrudType.LIST) {
                const resObjectList = <Array<TObject<TObjectSchema>>>(
                    action.payload.formData
                );
                let newObjectList: IObjectList<TObjectSchema> = {};
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
                let newObject = <TObject<TObjectSchema>>action.payload.formData;
                return {
                    objectList: {
                        ...objectStore.objectList,
                        [newObject.uuid]: newObject
                    },
                    requestStatus: action.payload.requestStatus,
                    lastChangedObjectID: action.payload.lastChangedObjectID
                };
            }

            // DELETE
            else if (action.crudType === CrudType.DELETE) {
                let newObject = <TObject<TObjectSchema>>action.payload.formData;
                return {
                    objectList: omit(objectStore.objectList, [newObject.uuid]),
                    requestStatus: action.payload.requestStatus
                };
            }
        }

        // async trigger
        else if (action.payload.requestStatus === RequestStatus.TRIGGERED) {
            return {
                ...objectStore,
                requestStatus: action.payload.requestStatus
            };
        }

        // async requesting & failure
        else {
            return {
                ...objectStore,
                ...action.payload
            };
        }

        // no effect
        return {
            ...objectStore
        };
    };

    const sagas = crudKeywords.map((crudKeyword) => 
        (<() => SagaIterator>ObjectRestApiRedux[crudKeyword][RequestStatus.TRIGGERED].saga)
    );

    return {
        actions: ObjectRestApiRedux,
        storeReducer: storeReducer,
        sagas
    };
};
