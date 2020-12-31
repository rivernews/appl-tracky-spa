import { IObjectBase, TObject, IObjectRestApiReduxFactoryActions, IObjectAction, ObjectRestApiJsonResponse, IObjectActionCreatorArgs } from "../types/factory-types";

import { CrudType, RequestStatus, IsSingleRestApiResponseTypeGuard, ISingleRestApiResponse, IListRestApiResponse } from "../../utils/rest-api";


export const RestApiActionCreatorsFactory = <ObjectRestApiSchema extends IObjectBase>(
    /** should have uuid */ objectName: string
): IObjectRestApiReduxFactoryActions<ObjectRestApiSchema> => {
    const crudKeywords = Object.values(CrudType);

    let ObjectRestApiActions: IObjectRestApiReduxFactoryActions<ObjectRestApiSchema> = {};
    for (let crudKeyword of crudKeywords) {
        const triggerActionTypeName = `${RequestStatus.TRIGGERED.toUpperCase()}_${crudKeyword.toUpperCase()}_${objectName.toUpperCase()}`;
        const requestingActionTypeName = `${RequestStatus.REQUESTING.toUpperCase()}_${crudKeyword.toUpperCase()}_${objectName.toUpperCase()}`;
        const successActionTypeName = `${RequestStatus.SUCCESS.toUpperCase()}_${crudKeyword.toUpperCase()}_${objectName.toUpperCase()}`;
        const failureActionTypeName = `${RequestStatus.FAILURE.toUpperCase()}_${crudKeyword.toUpperCase()}_${objectName.toUpperCase()}`;
        
        ObjectRestApiActions[crudKeyword] = {
            [RequestStatus.TRIGGERED]: {
                actionTypeName: triggerActionTypeName,
                action:
                    ({
                        objectClassInstance,
                        successCallback,
                        failureCallback,
                        finalCallback,
                        absoluteUrl,
                        triggerActionOptions
                    }: IObjectActionCreatorArgs<ObjectRestApiSchema>): IObjectAction<ObjectRestApiSchema> => {
                        return {
                            type: triggerActionTypeName,
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
                    }
            },
            [RequestStatus.REQUESTING]: {
                actionTypeName: requestingActionTypeName,
                action: 
                    (): IObjectAction<ObjectRestApiSchema> => {
                        return {
                            type: requestingActionTypeName,
                            crudType: crudKeyword,
                            payload: {
                                requestStatus: RequestStatus.REQUESTING
                            }
                        };
                    } 
            },
            [RequestStatus.SUCCESS]: {
                actionTypeName: successActionTypeName,
                action: 
                    (
                        /** api response */
                        jsonResponse: ObjectRestApiJsonResponse<ObjectRestApiSchema> | { uuid: string },
                        triggerFormData?: TObject<ObjectRestApiSchema> | Array<TObject<ObjectRestApiSchema>>
                    ): IObjectAction<ObjectRestApiSchema> => {
                        let newState = {
                            type: successActionTypeName,
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
                                    formData: <ISingleRestApiResponse<ObjectRestApiSchema>>(
                                        jsonResponse
                                    )
                                }
                            };
                        } else {
                            const formData = 
                                // if not coming from API request, i.e., saga manually called batchCreateAction(objects)
                                // then we just use it as-is
                                Array.isArray(jsonResponse) ? jsonResponse as TObject<ObjectRestApiSchema>[] :
                                // otherwise, it's a API response, which nests objects in `.results`
                                (<IListRestApiResponse<ObjectRestApiSchema>>(jsonResponse)).results;
                            
                            return {
                                ...newState,
                                payload: {
                                    requestStatus: RequestStatus.SUCCESS,
                                    formData
                                }
                            };
                        }
                    }
            },
            [RequestStatus.FAILURE]: {
                actionTypeName: failureActionTypeName,
                action:
                    (
                        error: any
                    ): IObjectAction<ObjectRestApiSchema> => {
                        return {
                            type: failureActionTypeName,
                            crudType: crudKeyword,
                            payload: {
                                requestStatus: RequestStatus.FAILURE,
                                error
                            }
                        };
                    }
            },
        };
    }

    return ObjectRestApiActions;
}
