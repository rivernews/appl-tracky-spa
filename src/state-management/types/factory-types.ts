import { Action, Reducer } from "redux";
import { SagaIterator } from "redux-saga";
import {
    RequestStatus,
    CrudType,
    ISingleRestApiResponse,
    IListRestApiResponse,
} from "../../utils/rest-api";
import { Schema } from "normalizr";
import { IReference } from "../../data-model/base-model";
import { IGraphQLQueryListResponse } from "../../utils/graphql-api";


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

export interface IObjectRestApiReduxFactoryActions<ObjectApiSchema>  {
    [crudType: string]: {
        [RequestStatus.TRIGGERED]: {
            actionTypeName: string;
            action:
                (args:IObjectActionCreatorArgs<ObjectApiSchema>) => IObjectAction<ObjectApiSchema>;
            saga?: () => SagaIterator;
        };

        [RequestStatus.REQUESTING]: {
            actionTypeName: string;
            action: () => IObjectAction<ObjectApiSchema>;
            saga?: () => SagaIterator;
        };

        [RequestStatus.SUCCESS]: {
            actionTypeName: string;
            action(
                jsonResponse?:
                    ObjectRestApiJsonResponse<ObjectApiSchema> |
                    // used by GroupedCompanyActionCreators
                    IObjectBase |
                    // used by batch operation e.g. `BATCHCREATE`, `BATCHUPDATE`
                    Array<IObjectBase> |
                    // used by GroupedCompanyActionCreators
                    { results: Array<ObjectApiSchema> | Array<IObjectBase>},
                triggerFormData?: TObject<ObjectApiSchema> | Array<TObject<ObjectApiSchema>> |
                    // used by GroupedCompanyActionCreators (DELETE, ...)
                    IObjectBase |
                    // used by batch delete (see `select-company-saga.ts`)
                    Array<IObjectBase> |
                    // used by GroupedCompanyActionCreators
                    string[]
            ): IObjectAction<ObjectApiSchema>;
            saga?: () => SagaIterator;
        };

        [RequestStatus.FAILURE]: {
            actionTypeName: string;
            action: (error: any) => IObjectAction<ObjectApiSchema>;
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
    // only for TRIGGER action
    absoluteUrl?: string;
    graphqlFunctionName?: string;
    graphqlArgs?: any;

    // misc options that when dispatch action can pass additional parameters
    triggerActionOptions?: ITriggerActionOptions<Schema>
    
    payload: {
        formData?:
            TObject<Schema> | 
            // used by GroupedCompanyActionCreators
            IObjectBase |
            Array<TObject<Schema>>;
        requestStatus: RequestStatus;
        error?: any;
    };
}

export interface IObjectActionCreatorArgs<ObjectApiSchema> {
    objectClassInstance?: ObjectApiSchema |
        // used by GroupedCompanyActionCreators
        IObjectBase,
    successCallback?: (jsonResponse: JsonResponseType<ObjectApiSchema>) => void,
    failureCallback?: (error: any) => void,
    finalCallback?: Function,
    absoluteUrl?: string,
    triggerActionOptions?: ITriggerActionOptions<ObjectApiSchema>

    // if specified, use graphql client instead of rest api client for fetching
    graphqlFunctionName?: string;
    graphqlArgs?: any;
}


/** factory API */

export interface IRestApiReduxFactory<Schema> {
    actions: IObjectRestApiReduxFactoryActions<Schema>;
    storeReducer: Reducer<IObjectStore<Schema>>
    sagas: Array<() => SagaIterator>;
}


export type ObjectRestApiJsonResponse<Schema> = IListRestApiResponse<TObject<Schema>> | ISingleRestApiResponse<TObject<Schema>>;

export type JsonResponseType<Schema> = ObjectRestApiJsonResponse<Schema> | IGraphQLQueryListResponse<Schema>;

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
            // TODO: let caller specify each schema of relational objects
            // to replace `any` here
            
            // make sure to check `RestApiSagaFactory` as well, need to specify schemas there too
            [relationalEntityKeys: string]: IObjectRestApiReduxFactoryActions<any>
        }
    }
}

export interface ITriggerActionOptions<Schema> {
    updateFromObject?: TObject<Schema>
}
