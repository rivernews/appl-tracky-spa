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
import { Schema, normalize, schema } from "normalizr";
import { IReference } from "../data-model/base-model";


/** state & store */
export interface IObjectBase {
    uuid: string;
}

export type TObject<Schema> = IObjectBase & { [Property in keyof Schema]: Schema[Property] };

export interface IObjectList<Schema> {
    [uuid: string]: TObject<Schema>;
}

export interface IObjectStore<Schema> {
    requestStatus: RequestStatus;
    error?: any;
    collection: IObjectList<Schema>;
}

/** action */

export type IObjectRestApiReduxFactoryActions = {
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
    triggerFormData?: TObject<Schema> | Array<TObject<Schema>> | Array<IReference>;

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
    data?: Array<TObject<Schema>> | TObject<Schema>
    updateFromObject?: TObject<Schema>
}

export interface ISagaFactoryOptions<ObjectSchema> {
    // completely overwrites factory's saga success handler
    overrideCrudSuccessSagaHandler?: {
        [key in CrudType]?: (
            args: ISuccessSagaHandlerArgs<ObjectSchema>
        ) => SagaIterator
    }

    // add-on and will be executed after factory's saga success handler
    doneCrudSuccessSagaHandler?: {
        [key in CrudType]?: (
            args: ISuccessSagaHandlerArgs<ObjectSchema>
        ) => SagaIterator
    }

    normalizeManifest?: {
        schema: Schema
        listSchema: Schema

        objectEntityKey: string

        relationalEntityReduxActionsMap: {
            [relationalEntityKeys: string]: IObjectRestApiReduxFactoryActions
        }
    }
}

export interface ITriggerActionOptions<Schema> {
    updateFromObject: TObject<Schema>
}

const RestApiReduxFactory = <Schema extends IObjectBase>(
    /** should have uuid */ objectName: string,
    initialObjectInstance: TObject<Schema>,
    reduxOptions: ISagaFactoryOptions<Schema> = {}
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
            let formData = triggerAction.payload.formData;
            const absoluteUrl = triggerAction.absoluteUrl;

            yield put(
                ObjectRestApiActions[crudKeyword][
                    RequestStatus.REQUESTING
                ].action()
            );

            try {
                // api call
                let jsonResponse: JsonResponseType<Schema> = yield call(
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

                // normalize primary object data (for relational object normalizing, will do it later) if  normalize manifest speciified
                let normalizeData: undefined | Array<TObjectSchema> = undefined;
                let relationalNormalizeData: undefined | {
                    [relationalEntityKey: string]: Array<TObjectSchema>
                } = undefined;
                
                if (reduxOptions.normalizeManifest) {
                    process.env.NODE_ENV === 'development' && console.log("Saga: receive normalizeManifest");

                    const normalizeObjectEntityKey = reduxOptions.normalizeManifest.objectEntityKey;

                    let dataSource = undefined;
                    if (crudKeyword === CrudType.DELETE) {
                        dataSource = formData;
                    }
                    else if (IsSingleRestApiResponseTypeGuard(jsonResponse)) {
                        dataSource = jsonResponse;
                    }
                    else {
                        dataSource = jsonResponse.results;
                    }
                    process.env.NODE_ENV === 'development' && console.log("Saga: jsonResponse is", jsonResponse);
                    process.env.NODE_ENV === 'development' && console.log("Saga: formData is", formData);
                    process.env.NODE_ENV === 'development' && console.log("Saga: data source is", dataSource);

                    const normalizeDataSource = normalize(
                        dataSource,
                        Array.isArray(dataSource) ? reduxOptions.normalizeManifest.listSchema : reduxOptions.normalizeManifest.schema
                    );
                    process.env.NODE_ENV === 'development' && console.log("Saga: normalized data source is", normalizeDataSource);

                    normalizeData = Object.values(normalizeDataSource.entities[normalizeObjectEntityKey]);
                    if (crudKeyword === CrudType.DELETE) {
                        formData = normalizeData;
                    }
                    else if (IsSingleRestApiResponseTypeGuard(jsonResponse)) {
                        jsonResponse = normalizeData[0];
                    }
                    else {
                        jsonResponse.results = normalizeData;
                    }
                    process.env.NODE_ENV === 'development' && console.log("Saga: data to dispatch SUCCESS action", crudKeyword === CrudType.DELETE ? formData : jsonResponse);

                    relationalNormalizeData = Object.keys(reduxOptions.normalizeManifest.relationalEntityReduxActionsMap).filter(key => normalizeDataSource.entities.hasOwnProperty(key)).reduce((accumulate, relationalEntityKey) => ({
                        ...accumulate,
                        [relationalEntityKey]: Object.values(normalizeDataSource.entities[relationalEntityKey])
                    }), {});
                    process.env.NODE_ENV === 'development' && console.log("relational normalize data for SUCCESS action", relationalNormalizeData);
                }

                // handle success state --

                // dispatch relational object actions, if normalize is needed (normalize manifest specified)
                if (reduxOptions.normalizeManifest && relationalNormalizeData) {
                    process.env.NODE_ENV === 'development' && console.log('Saga: about to dispatch relational, normalized objects');

                    switch (crudKeyword) {
                        case CrudType.UPDATE:
                            // relational object will do nothing when primary action is UPDATE - UPDATE is purely on primary object
                            break
                            
                        case CrudType.LIST: 
                            // relational objects should also apply LIST
                        case CrudType.CREATE:
                            // when there's a fresh new object created, if there're relational objects present then will also apply LIST to them
                            for (const relationalEntityKey in reduxOptions.normalizeManifest.relationalEntityReduxActionsMap) {
                                if (
                                    // if no embed data, normalizr will not include it in `entities`
                                    // so don't compare length; just compare its key existence
                                    !relationalNormalizeData[relationalEntityKey] 
                                ) {
                                    process.env.NODE_ENV === 'development' && console.log('skip for relational key', relationalEntityKey)
                                    continue;
                                }

                                const dispatchResponseData = IsSingleRestApiResponseTypeGuard(jsonResponse) ? (
                                    relationalNormalizeData[relationalEntityKey][0]
                                ) : {
                                    results: relationalNormalizeData[relationalEntityKey]
                                };

                                process.env.NODE_ENV === 'development' && console.log(`Saga: relational action dispatch; crud=${crudKeyword}, entity=${relationalEntityKey}, dispatchResponseData for action is`, dispatchResponseData);

                                const relationalActions = reduxOptions.normalizeManifest.relationalEntityReduxActionsMap[relationalEntityKey] as IObjectRestApiReduxFactoryActions;
                                
                                yield put(
                                    relationalActions[crudKeyword][RequestStatus.SUCCESS].action(dispatchResponseData)
                                );
                            }
                            break;
                        
                        case CrudType.DELETE:
                            // relational objects should apply DELETE action -- this is a bulk deletion, not single delete
                            for (const relationalEntityKey in reduxOptions.normalizeManifest.relationalEntityReduxActionsMap) {
                                const relationalActions = reduxOptions.normalizeManifest.relationalEntityReduxActionsMap[relationalEntityKey] as IObjectRestApiReduxFactoryActions;
                                yield put(
                                    relationalActions[CrudType.DELETE][RequestStatus.SUCCESS].action(undefined, formData)
                                );
                            }
                            break;

                        default:
                            break;
                    }
                } 

                // dispatch primary object action
                const overrideCrudSuccessSagaHandler: ((args: ISuccessSagaHandlerArgs<Schema>) => void) | undefined = (
                    reduxOptions.overrideCrudSuccessSagaHandler &&
                    reduxOptions.overrideCrudSuccessSagaHandler.hasOwnProperty(crudKeyword) &&
                    reduxOptions.overrideCrudSuccessSagaHandler[crudKeyword as CrudType] // only call the corresponding CRUD success saga handler
                ) ? (
                    reduxOptions.overrideCrudSuccessSagaHandler[crudKeyword as CrudType]
                ) : undefined;
                if (overrideCrudSuccessSagaHandler) {
                    // use custom handler if provided
                    yield call(overrideCrudSuccessSagaHandler, {
                        data: normalizeData ? normalizeData : (
                            crudKeyword === CrudType.DELETE ? formData : jsonResponse
                        ),
                        updateFromObject: triggerAction.triggerActionOptions ? triggerAction.triggerActionOptions.updateFromObject : undefined
                    });
                }
                else {
                    // default handler
                    if (crudKeyword === CrudType.DELETE) {
                        process.env.NODE_ENV === 'development' && console.log("Saga: ready to dispatch delete action, formData =", formData)
                        yield put(
                            ObjectRestApiActions[CrudType.DELETE][
                                RequestStatus.SUCCESS
                            ].action(undefined, formData)
                        );  
                    } else {
                        process.env.NODE_ENV === 'development' && console.log("Saga: ready to dispatch success action, jsonResponse =", jsonResponse)
                        yield put(
                            ObjectRestApiActions[crudKeyword][
                                RequestStatus.SUCCESS
                            ].action(jsonResponse)
                        );
                    }
                }

                // add-on behavior
                const doneCrudSuccessSagaHandler = reduxOptions.doneCrudSuccessSagaHandler && reduxOptions.doneCrudSuccessSagaHandler[crudKeyword as CrudType] ? reduxOptions.doneCrudSuccessSagaHandler[crudKeyword as CrudType] : undefined;
                if (doneCrudSuccessSagaHandler) {
                    yield call(doneCrudSuccessSagaHandler, {
                            data: normalizeData ? normalizeData : (
                                crudKeyword === CrudType.DELETE ? formData : jsonResponse
                            ),
                            updateFromObject: triggerAction.triggerActionOptions ? triggerAction.triggerActionOptions.updateFromObject : undefined
                        }
                    );
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
                let targetDeleteUuids = [];
                if (!Array.isArray(objectAction.triggerFormData)) {
                    const targetDeleteObject = <TObject<TObjectSchema>>objectAction.triggerFormData;
                    process.env.NODE_ENV === 'development' && console.log("Reducer: delete, targetobj=", targetDeleteObject)
                    targetDeleteUuids.push(targetDeleteObject.uuid);
                } else {
                    const targetDeleteObjectList = <Array<TObject<TObjectSchema>>>objectAction.triggerFormData;
                    process.env.NODE_ENV === 'development' && console.log("Reducer: delete, targetobjList=", targetDeleteObjectList);
                    targetDeleteUuids = targetDeleteObjectList.map(targetDeleteObject => targetDeleteObject.uuid);
                }
                
                process.env.NODE_ENV === 'development' && console.log("Reducer: delete, beforestore=", objectStore)
                const afterStore = {
                    collection: omit(objectStore.collection, targetDeleteUuids),
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
