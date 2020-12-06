import { IObjectBase, TObject, IObjectRestApiReduxFactoryActions, JsonResponseType, ITriggerActionOptions, IObjectAction, ObjectRestApiJsonResponse } from "../types/factory-types";

import { CrudType, RequestStatus, IsSingleRestApiResponseTypeGuard, ISingleRestApiResponse, IListRestApiResponse } from "../../utils/rest-api";


export const RestApiActionCreatorsFactory = <ObjectRestApiSchema extends IObjectBase>(
    /** should have uuid */ objectName: string
): IObjectRestApiReduxFactoryActions => {
    const crudKeywords = Object.values(CrudType);

    let ObjectRestApiActions: IObjectRestApiReduxFactoryActions = {};
    for (let crudKeyword of crudKeywords) {
        ObjectRestApiActions[crudKeyword] = {};

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
            objectClassInstance?: ObjectRestApiSchema,
            successCallback?: (jsonResponse: JsonResponseType<ObjectRestApiSchema>) => void,
            failureCallback?: (error: any) => void,
            finalCallback?: Function,
            absoluteUrl?: string,
            triggerActionOptions?: ITriggerActionOptions<ObjectRestApiSchema>
        ): IObjectAction<ObjectRestApiSchema> => {
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
        ].action = (): IObjectAction<ObjectRestApiSchema> => {
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
            jsonResponse: ObjectRestApiJsonResponse<ObjectRestApiSchema>,
            triggerFormData?: TObject<ObjectRestApiSchema> | Array<TObject<ObjectRestApiSchema>>
        ): IObjectAction<ObjectRestApiSchema> => {
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
        };
        ObjectRestApiActions[crudKeyword][RequestStatus.FAILURE].action = (
            error: any
        ): IObjectAction<ObjectRestApiSchema> => {
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
    }

    return ObjectRestApiActions;
}
