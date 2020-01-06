import { IObjectBase, IObjectRestApiReduxFactoryActions, JsonResponseType, ITriggerActionOptions, IObjectAction, ISuccessSagaHandlerArgs, ISagaFactoryOptions } from "../types/factory-types";

import { CrudType, RequestStatus, IsSingleRestApiResponseTypeGuard, ISingleRestApiResponse, IListRestApiResponse, IRequestParams, RestApiService, CrudMapToRest } from "../../utils/rest-api";
import { SagaIterator } from "redux-saga";
import { actionChannel, take, call, put } from "redux-saga/effects";
import { normalize } from "normalizr";


export const RestApiSagaFactory = <ObjectRestApiSchema extends IObjectBase>(
    /** should have uuid */ objectName: string,
    ObjectRestApiActions: IObjectRestApiReduxFactoryActions,
    sagaFactoryOptions: ISagaFactoryOptions<ObjectRestApiSchema>
): Array<() => SagaIterator> => {
    const crudKeywords = Object.values(CrudType) as Array<CrudType>;

    const sagas = crudKeywords.map((crudKeyword) => {

        const sagaHandler = function* (
            triggerAction: IObjectAction<ObjectRestApiSchema>
        ) {
            process.env.NODE_ENV === 'development' && console.log(`Saga: action intercepted; aync=trigger, crud=${crudKeyword}, obj=${objectName}; ready to call api`);
            let formData: ObjectRestApiSchema | Array<ObjectRestApiSchema> | undefined = triggerAction.payload.formData;
            const absoluteUrl = triggerAction.absoluteUrl;

            yield put(
                ObjectRestApiActions[crudKeyword][
                    RequestStatus.REQUESTING
                ].action()
            );

            try {
                // api call
                let jsonResponse: JsonResponseType<ObjectRestApiSchema> = yield call(
                    (<(params: IRequestParams<ObjectRestApiSchema>) => void>RestApiService[CrudMapToRest(crudKeyword)]),
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
                if (jsonResponse.next) {
                    process.env.NODE_ENV === 'development' && console.log("Saga: res contains next url, so we will also trigger list request for next=", jsonResponse.next);
                    yield put(ObjectRestApiActions[CrudType.LIST][RequestStatus.TRIGGERED].action(
                        undefined, undefined, undefined, undefined, jsonResponse.next
                    ));
                }

                // normalize primary object data (for relational object normalizing, will do it later) if  normalize manifest speciified
                let normalizeData: undefined | Array<ObjectRestApiSchema> = undefined;
                let relationalNormalizeData: undefined | {
                    [relationalEntityKey: string]: Array<ObjectRestApiSchema>
                } = undefined;

                if (sagaFactoryOptions.normalizeManifest) {
                    process.env.NODE_ENV === 'development' && console.log("Saga: receive normalizeManifest");

                    const normalizeObjectEntityKey = sagaFactoryOptions.normalizeManifest.objectEntityKey;

                    // collect data from meaningful source
                    let dataSource = undefined;
                    if (crudKeyword === CrudType.DELETE) {
                        dataSource = formData;
                    }
                    else if (IsSingleRestApiResponseTypeGuard(jsonResponse)) {
                        dataSource = jsonResponse as ObjectRestApiSchema;
                    }
                    else {
                        dataSource = jsonResponse.results as Array<ObjectRestApiSchema>;
                    }
                    process.env.NODE_ENV === 'development' && console.log("Saga: jsonResponse is", jsonResponse);
                    process.env.NODE_ENV === 'development' && console.log("Saga: formData is", formData);
                    process.env.NODE_ENV === 'development' && console.log("Saga: data source is", dataSource);

                    // normalize all data once for all
                    const normalizeDataSourceSchema = Array.isArray(dataSource) ? (sagaFactoryOptions.normalizeManifest.listSchema) : (sagaFactoryOptions.normalizeManifest.schema);
                    const normalizeDataSource = normalize(dataSource, normalizeDataSourceSchema);
                    process.env.NODE_ENV === 'development' && console.log("Saga: normalized data source is", normalizeDataSource);

                    // place noramlized data to variables to fit in existing framework
                    normalizeData = Object.values(normalizeDataSource.entities[normalizeObjectEntityKey]);
                    if (crudKeyword === CrudType.DELETE) {
                        formData = normalizeData.length === 1 ? normalizeData[0] : normalizeData;
                    }
                    else if (IsSingleRestApiResponseTypeGuard(jsonResponse)) {
                        jsonResponse = normalizeData[0];
                    }
                    else {
                        jsonResponse.results = normalizeData;
                    }
                    process.env.NODE_ENV === 'development' && console.log("Saga: data to dispatch SUCCESS action", crudKeyword === CrudType.DELETE ? formData : jsonResponse);

                    // prepare relational data for later use
                    relationalNormalizeData = Object.keys(sagaFactoryOptions.normalizeManifest.relationalEntityReduxActionsMap).filter(key => normalizeDataSource.entities.hasOwnProperty(key)).reduce((accumulate, relationalEntityKey) => ({
                        ...accumulate,
                        [relationalEntityKey]: Object.values(normalizeDataSource.entities[relationalEntityKey])
                    }), {});
                    process.env.NODE_ENV === 'development' && console.log("relational normalize data for SUCCESS action", relationalNormalizeData);
                }

                // handle success state --

                // dispatch relational object actions, if normalize is needed (normalize manifest specified)
                if (sagaFactoryOptions.normalizeManifest && relationalNormalizeData) {
                    process.env.NODE_ENV === 'development' && console.log('Saga: about to dispatch relational, normalized objects');

                    switch (crudKeyword) {
                        case CrudType.UPDATE:
                            // relational object will do nothing when primary action is UPDATE - UPDATE is purely on primary object
                            break

                        case CrudType.LIST:
                        // relational objects should also apply LIST
                        case CrudType.CREATE:
                            // when there's a fresh new object created, if there're relational objects present then will also apply LIST to them
                            for (const relationalEntityKey in sagaFactoryOptions.normalizeManifest.relationalEntityReduxActionsMap) {
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

                                const relationalActions = sagaFactoryOptions.normalizeManifest.relationalEntityReduxActionsMap[relationalEntityKey] as IObjectRestApiReduxFactoryActions;

                                yield put(
                                    relationalActions[crudKeyword][RequestStatus.SUCCESS].action(dispatchResponseData)
                                );
                            }
                            break;

                        case CrudType.DELETE:
                            // if got `overrideCrudSuccessHandler.delete`, we will not do any side effects (dispatching actions) to redux store
                            // we'll let `overrideCrudSuccessHandler.delete` handle all side effects to redux store
                            if (sagaFactoryOptions.overrideCrudSuccessSagaHandler && sagaFactoryOptions.overrideCrudSuccessSagaHandler.delete) {
                                break;
                            }

                            // because formData is always already normalized and we only have 1st-level-relationship's uuids, we will only dispatch delete action for 1st level relational fields. 
                            // we will not do cascade delete for nested && relational field.
                            // if you need cascade delete to deal with nested relational fields, you'll have to write your own `overrideCrudSuccessHandler.delete` in the sagaOptions.

                            // in backend, cascade delete should already be handled.
                            // here we are only cleaning up / cascade delete the frontend redux store

                            for (const relationalEntityKey in sagaFactoryOptions.normalizeManifest.relationalEntityReduxActionsMap) {
                                const relationalActions = sagaFactoryOptions.normalizeManifest.relationalEntityReduxActionsMap[relationalEntityKey] as IObjectRestApiReduxFactoryActions;

                                // relational objects should apply DELETE action -- this is a bulk deletion, not single delete
                                const dispatchDeleteData = relationalNormalizeData[relationalEntityKey] ? relationalNormalizeData[relationalEntityKey] : (
                                    formData && !Array.isArray(formData) && formData.hasOwnProperty(relationalEntityKey) ? (<ObjectRestApiSchema>formData)[relationalEntityKey as keyof ObjectRestApiSchema] : []
                                );

                                yield put(
                                    relationalActions[CrudType.DELETE][RequestStatus.SUCCESS].action(undefined, dispatchDeleteData)
                                );
                            }
                            break;

                        default:
                            break;
                    }
                }

                // dispatch primary object action
                const overrideCrudSuccessSagaHandler: ((args: ISuccessSagaHandlerArgs<ObjectRestApiSchema>) => void) | undefined = (
                    sagaFactoryOptions.overrideCrudSuccessSagaHandler &&
                    sagaFactoryOptions.overrideCrudSuccessSagaHandler.hasOwnProperty(crudKeyword) &&
                    sagaFactoryOptions.overrideCrudSuccessSagaHandler[crudKeyword as CrudType] // only call the corresponding CRUD success saga handler
                ) ? (
                        sagaFactoryOptions.overrideCrudSuccessSagaHandler[crudKeyword as CrudType]
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
                const doneCrudSuccessSagaHandler = sagaFactoryOptions.doneCrudSuccessSagaHandler && sagaFactoryOptions.doneCrudSuccessSagaHandler[crudKeyword as CrudType] ? sagaFactoryOptions.doneCrudSuccessSagaHandler[crudKeyword as CrudType] : undefined;
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

        // saga listener
        const saga = function* () {
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

        return saga;
    }
    );

    return sagas;
}