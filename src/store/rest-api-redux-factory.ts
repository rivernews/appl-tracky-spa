import { Action, Reducer } from "redux";
import { takeEvery, take, call, put, actionChannel } from "redux-saga/effects";
import { SagaIterator } from "redux-saga";
import {
    RequestStatus,
    CrudType,
    CrudMapToRest,
    RestApiService,
    IRequestParams,
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
    lastChangedObjectID?: string;
    requestStatus: RequestStatus;
    error?: any;
    collection: IObjectList<Schema>;
}

/** action */

type IObjectRestApiReduxFactoryActions = {
    [restfulKeyword: string]: {
        [asyncKeyword: string]: {
            actionTypeName: string;
            action: Function;
            saga?: () => SagaIterator;
        };
    };
};

export interface IObjectAction<Schema> extends Action {
    type: string;
    crudType: CrudType;

    // for deleteAction or other actions to obtain the original instance obj passed into trigger action
    triggerFormData?: TObject<Schema> | Array<TObject<Schema>>;

    // for saga to perform additional side effect e.g. navigation
    callback?: Function;

    // for custumized api call
    absoluteUrl?: string
    
    payload: {
        formData?: TObject<Schema> | Array<TObject<Schema>>;
        lastChangedObjectID?: string;
        requestStatus: RequestStatus;
        error?: any;
    };
}

/** factory API */

interface IRestApiReduxFactory<Schema> {
    actions: IObjectRestApiReduxFactoryActions;
    storeReducer: Reducer<IObjectStore<Schema>>
    sagas: Array<() => SagaIterator>;
}

export const RestApiReduxFactory = <Schema extends IObjectBase>(
    /** should have uuid */ objectName: string,
    initialObjectInstance: TObject<Schema>
): IRestApiReduxFactory<Schema> => {
    type TObjectSchema = typeof initialObjectInstance;
    const crudKeywords = Object.values(CrudType);

    let ObjectRestApiRedux: IObjectRestApiReduxFactoryActions = {};
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
            objectClassInstance?: TObjectSchema,
            callback?: Function,
            absoluteUrl?: string,
        ): IObjectAction<TObjectSchema> => {
            console.log(`action:fired, trigger, ${crudKeyword}`);
            return {
                type:
                    ObjectRestApiRedux[crudKeyword][RequestStatus.TRIGGERED]
                        .actionTypeName,
                crudType: crudKeyword,
                callback,
                absoluteUrl,
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
            /** api response */
            jsonResponse:
            | IListRestApiResponse<TObjectSchema>
            | ISingleRestApiResponse<TObjectSchema>,
            triggerFormData?: TObject<Schema> | Array<TObject<Schema>>
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
                    triggerFormData,
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
            const absoluteUrl = triggerAction.absoluteUrl;

            yield put(
                ObjectRestApiRedux[crudKeyword][
                    RequestStatus.REQUESTING
                ].action()
            );

            try {
                // api call
                const jsonResponse:
                    | IListRestApiResponse<TObjectSchema>
                    | ISingleRestApiResponse<TObjectSchema> 
                    | any = yield call(
                    (<(params: IRequestParams<TObjectSchema>) => void>RestApiService[CrudMapToRest(crudKeyword)]),
                    {
                        data: formData,
                        objectName,
                        absoluteUrl,
                    }
                );

                console.log("Saga: res from server", jsonResponse);

                if (jsonResponse.status && jsonResponse.status >= 400) {
                    console.error("Server error, see message in res.");
                    throw new Error("Server error, see message in res.");
                } 

                // if there is .next in res, then it's paginated data and we should perform a next request to next page data
                if(jsonResponse.next) {
                    console.log("Saga: res contains next url, so we will also trigger list request for next=", jsonResponse.next);
                    yield put(ObjectRestApiRedux[CrudType.LIST][RequestStatus.TRIGGERED].action(
                        undefined, undefined, jsonResponse.next
                    ));
                }

                // success state
                if (crudKeyword === CrudType.DELETE) {
                    yield put(
                        ObjectRestApiRedux[CrudType.DELETE][
                            RequestStatus.SUCCESS
                        ].action(jsonResponse, formData)
                    );
                } else {
                    console.log("Saga: ready to dispatch success action")
                    yield put(
                        ObjectRestApiRedux[crudKeyword][
                            RequestStatus.SUCCESS
                        ].action(jsonResponse)
                    );
                }

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
            
            // queue style 
            const objectTriggerActionChannel = yield actionChannel(
                ObjectRestApiRedux[crudKeyword][RequestStatus.TRIGGERED]
                    .actionTypeName
            )

            while (true) {
                const objectTriggerAction = yield take(objectTriggerActionChannel);
                yield call(sagaHandler, objectTriggerAction);
            }
        };
    }

    const initialState: IObjectStore<TObjectSchema> = {
        collection: {},
        requestStatus: RequestStatus.SUCCESS
    };

    const storeReducer: Reducer<IObjectStore<Schema>> = (
        objectStore: IObjectStore<TObjectSchema> = initialState,
        action: Action
    ): IObjectStore<TObjectSchema> => {
        
        const objectAction = action as IObjectAction<TObjectSchema>;

        if (
            !(objectAction && objectAction.payload && objectAction.payload.requestStatus) ||
            !(action.type.split("_")[2] === objectName.toUpperCase())
        ) {
            return {
                ...objectStore
            };
        }

        // async success
        if (objectAction.payload.requestStatus === RequestStatus.SUCCESS) {
            // CREATE
            if (objectAction.crudType === CrudType.CREATE) {
                let newObject = <TObject<TObjectSchema>>objectAction.payload.formData;
                return {
                    collection: {
                        ...objectStore.collection,
                        [newObject.uuid]: newObject
                    },
                    requestStatus: objectAction.payload.requestStatus,
                    lastChangedObjectID: objectAction.payload.lastChangedObjectID
                };
            }

            // LIST
            else if (objectAction.crudType === CrudType.LIST) {
                const resObjectList = <Array<TObject<TObjectSchema>>>(
                    objectAction.payload.formData
                );
                let newObjects: IObjectList<TObjectSchema> = {};
                for (let object of resObjectList) {
                    newObjects[object.uuid] = object;
                }
                console.log("Reducer: crud=list, action=", objectAction)
                console.log("initialState=", initialState)
                console.log("beforestore=", objectStore)
                console.log("newlistobjects=", newObjects)

                const afterStore: IObjectStore<TObjectSchema> = {
                    collection: {
                        ...objectStore.collection,
                        ...newObjects
                    },
                    requestStatus: objectAction.payload.requestStatus
                };
                console.log("afterstore=", afterStore)

                return afterStore;
            }

            // UPDATE
            else if (objectAction.crudType === CrudType.UPDATE) {
                let newObject = <TObject<TObjectSchema>>objectAction.payload.formData;
                return {
                    collection: {
                        ...objectStore.collection,
                        [newObject.uuid]: newObject
                    },
                    requestStatus: objectAction.payload.requestStatus,
                    lastChangedObjectID: objectAction.payload.lastChangedObjectID
                };
            }

            // DELETE
            else if (objectAction.crudType === CrudType.DELETE) {
                let targetDeleteObject = <TObject<TObjectSchema>>objectAction.triggerFormData;
                console.log("Reducer: delete, targetobj=", targetDeleteObject)

                console.log("Reducer: delete, beforestore=", objectStore)
                
                const afterStore = {
                    collection: omit(objectStore.collection, [targetDeleteObject.uuid]),
                    requestStatus: objectAction.payload.requestStatus
                }
                console.log("Reducer: delete, afterstore", afterStore)

                return afterStore;
            }
        }

        // async trigger
        else if (objectAction.payload.requestStatus === RequestStatus.TRIGGERED) {
            return {
                ...objectStore,
                requestStatus: objectAction.payload.requestStatus
            };
        }

        // async requesting & failure
        else {
            return {
                ...objectStore,
                ...objectAction.payload
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
        storeReducer,
        sagas
    };
};
