import { Action, Reducer } from "redux";
import { take, call, put, actionChannel } from "redux-saga/effects";
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
    // only for triggerActions
    successCallback?: Function;
    failureCallback?: (error: any) => void;
    finalCallback?: Function;

    // for custumized api call
    absoluteUrl?: string

    // misc options that when dispatch action can pass additional parameters
    triggerActionOptions?: ITriggerActionOptions<Schema>
    
    payload: {
        formData?: TObject<Schema> | Array<TObject<Schema>>;
        requestStatus: RequestStatus;
        error?: any;
    };
}

/** factory API */

export interface IRestApiReduxFactory<Schema> {
    actions: IObjectRestApiReduxFactoryActions;
    storeReducer: Reducer<IObjectStore<Schema>>
    sagas: Array<() => SagaIterator>;
}


export type ObjectRestApiJsonResponse<Schema> = IListRestApiResponse<TObject<Schema>> | ISingleRestApiResponse<TObject<Schema>>
// TODO: remove any
export type JsonResponseType<Schema> = ObjectRestApiJsonResponse<Schema> | any;

export interface ISuccessSagaHandlerArgs<Schema> {
    jsonResponse: JsonResponseType<Schema>
    formData?: TObject<Schema> | Array<TObject<Schema>>
    updateFromObject?: TObject<Schema>
}

interface IReduxFactoryOptions<Schema> {
    successSagaHandler?: {
        [key in CrudType]?: (
            args: ISuccessSagaHandlerArgs<Schema>
        ) => SagaIterator
    }
}

interface ITriggerActionOptions<Schema> {
    updateFromObject: TObject<Schema>
}

export const RestApiReduxFactory = <Schema extends IObjectBase>(
    /** should have uuid */ objectName: string,
    initialObjectInstance: TObject<Schema>,
    reduxOptions: IReduxFactoryOptions<Schema> = {}
): IRestApiReduxFactory<Schema> => {
    type TObjectSchema = typeof initialObjectInstance;
    const crudKeywords = Object.values(CrudType);

    let ObjectRestApiActions: IObjectRestApiReduxFactoryActions = {};
    for (let crudKeyword of crudKeywords) {
        ObjectRestApiActions[crudKeyword] = {};
        /** store */
        // TODO?: action state

        /** action */
        // action type names
        for (let requestStatus of Object.values(RequestStatus)) {
            ObjectRestApiActions[crudKeyword][requestStatus] = {
                actionTypeName: "",
                action: () => {}
            };
            ObjectRestApiActions[crudKeyword][
                requestStatus
            ].actionTypeName = `${requestStatus.toUpperCase()}_${crudKeyword.toUpperCase()}_${objectName.toUpperCase()}`;
        }

        // async actions ( & state...)
        ObjectRestApiActions[crudKeyword][RequestStatus.TRIGGERED].action = (
            objectClassInstance?: TObjectSchema,
            successCallback?: (jsonResponse: JsonResponseType<TObjectSchema>) => void,
            failureCallback?: (error: any) => void,
            finalCallback?: Function,
            absoluteUrl?: string,
            triggerActionOptions?: ITriggerActionOptions<TObjectSchema>
        ): IObjectAction<TObjectSchema> => {
            process.env.NODE_ENV === 'development' && console.log(`action:fired, trigger, ${crudKeyword}`);
            return {
                type:
                    ObjectRestApiActions[crudKeyword][RequestStatus.TRIGGERED]
                        .actionTypeName,
                crudType: crudKeyword,
                finalCallback,
                successCallback,
                failureCallback,
                absoluteUrl,
                triggerActionOptions,
                payload: {
                    requestStatus: RequestStatus.TRIGGERED,
                    formData: objectClassInstance
                }
            };
        };
        ObjectRestApiActions[crudKeyword][
            RequestStatus.REQUESTING
        ].action = (): IObjectAction<TObjectSchema> => {
            return {
                type:
                    ObjectRestApiActions[crudKeyword][RequestStatus.REQUESTING]
                        .actionTypeName,
                crudType: crudKeyword,
                payload: {
                    requestStatus: RequestStatus.REQUESTING
                }
            };
        };
        ObjectRestApiActions[crudKeyword][RequestStatus.SUCCESS].action = (
            /** api response */
            jsonResponse: ObjectRestApiJsonResponse<Schema>,
            triggerFormData?: TObject<Schema> | Array<TObject<Schema>>
        ): IObjectAction<TObjectSchema> => {
            let newState = {
                type:
                    ObjectRestApiActions[crudKeyword][RequestStatus.SUCCESS]
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
                        )
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
        ObjectRestApiActions[crudKeyword][RequestStatus.FAILURE].action = (
            error: any
        ): IObjectAction<TObjectSchema> => {
            return {
                type:
                    ObjectRestApiActions[crudKeyword][RequestStatus.FAILURE]
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
            process.env.NODE_ENV === 'development' && console.log(`Saga: action intercepted; aync=trigger, crud=${crudKeyword}, obj=${objectName}; ready to call api`);
            const formData = triggerAction.payload.formData;
            const absoluteUrl = triggerAction.absoluteUrl;

            yield put(
                ObjectRestApiActions[crudKeyword][
                    RequestStatus.REQUESTING
                ].action()
            );

            try {
                // api call
                const jsonResponse: JsonResponseType<Schema> = yield call(
                    (<(params: IRequestParams<TObjectSchema>) => void>RestApiService[CrudMapToRest(crudKeyword)]),
                    {
                        data: formData,
                        objectName,
                        absoluteUrl,
                    }
                );

                process.env.NODE_ENV === 'development' && console.log("Saga: res from server", jsonResponse);

                if (jsonResponse.status && jsonResponse.status >= 400) {
                    console.error("Server error, see message in res.");
                    throw new Error("Server error, see message in res.");
                } 

                // if there is .next in res, then it's paginated data and we should perform a next request to next page data
                if(jsonResponse.next) {
                    process.env.NODE_ENV === 'development' && console.log("Saga: res contains next url, so we will also trigger list request for next=", jsonResponse.next);
                    yield put(ObjectRestApiActions[CrudType.LIST][RequestStatus.TRIGGERED].action(
                        undefined, undefined, undefined, undefined, jsonResponse.next
                    ));
                }

                // handle success state

                // use custom handler if provided
                const customSuccessSagaHandler: ((args: ISuccessSagaHandlerArgs<Schema>) => void) | undefined = (
                    reduxOptions.successSagaHandler &&
                    reduxOptions.successSagaHandler.hasOwnProperty(crudKeyword) &&
                    reduxOptions.successSagaHandler[crudKeyword as CrudType] // only call the corresponding CRUD success saga handler
                ) ? (
                    reduxOptions.successSagaHandler[crudKeyword as CrudType]
                ) : undefined;
                if (customSuccessSagaHandler) {
                    yield call(customSuccessSagaHandler, {
                        jsonResponse,
                        formData,
                        updateFromObject: triggerAction.triggerActionOptions && triggerAction.triggerActionOptions.updateFromObject ? triggerAction.triggerActionOptions.updateFromObject : undefined
                    });
                }
                else {
                    // default handler
                    if (crudKeyword === CrudType.DELETE) {
                        yield put(
                            ObjectRestApiActions[CrudType.DELETE][
                                RequestStatus.SUCCESS
                            ].action(jsonResponse, formData)
                        );  
                    } else {
                        process.env.NODE_ENV === 'development' && console.log("Saga: ready to dispatch success action")
                        yield put(
                            ObjectRestApiActions[crudKeyword][
                                RequestStatus.SUCCESS
                            ].action(jsonResponse)
                        );
                    }
                }

                if (triggerAction.successCallback) {
                    triggerAction.successCallback(jsonResponse);
                }
            } catch (error) {
                // error state
                yield put(
                    ObjectRestApiActions[crudKeyword][
                        RequestStatus.FAILURE
                    ].action(error)
                );

                if (triggerAction.failureCallback) {
                    triggerAction.failureCallback(error);
                }
                return;
            }

            if (triggerAction.finalCallback) {
                triggerAction.finalCallback();
            }
        };

        ObjectRestApiActions[crudKeyword][
            RequestStatus.TRIGGERED
        ].saga = function*() {
            process.env.NODE_ENV === 'development' && console.log(`Saga: action intercepted; async=trigger, crud=${crudKeyword}, obj=${objectName}`);
            
            // queue style 
            const objectTriggerActionChannel = yield actionChannel(
                ObjectRestApiActions[crudKeyword][RequestStatus.TRIGGERED]
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
                    requestStatus: objectAction.payload.requestStatus
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
                process.env.NODE_ENV === 'development' && console.log("Reducer: crud=list, action=", objectAction)
                process.env.NODE_ENV === 'development' && console.log("initialState=", initialState)
                process.env.NODE_ENV === 'development' && console.log("beforestore=", objectStore)
                process.env.NODE_ENV === 'development' && console.log("newlistobjects=", newObjects)

                const afterStore: IObjectStore<TObjectSchema> = {
                    collection: {
                        ...objectStore.collection,
                        ...newObjects
                    },
                    requestStatus: objectAction.payload.requestStatus
                };
                process.env.NODE_ENV === 'development' && console.log("afterstore=", afterStore)

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
                    requestStatus: objectAction.payload.requestStatus
                };
            }

            // DELETE
            else if (objectAction.crudType === CrudType.DELETE) {
                let targetDeleteObject = <TObject<TObjectSchema>>objectAction.triggerFormData;
                process.env.NODE_ENV === 'development' && console.log("Reducer: delete, targetobj=", targetDeleteObject)

                process.env.NODE_ENV === 'development' && console.log("Reducer: delete, beforestore=", objectStore)
                
                const afterStore = {
                    collection: omit(objectStore.collection, [targetDeleteObject.uuid]),
                    requestStatus: objectAction.payload.requestStatus
                }
                process.env.NODE_ENV === 'development' && console.log("Reducer: delete, afterstore", afterStore)

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
        (<() => SagaIterator>ObjectRestApiActions[crudKeyword][RequestStatus.TRIGGERED].saga)
    );

    return {
        actions: ObjectRestApiActions,
        storeReducer,
        sagas
    };
};
