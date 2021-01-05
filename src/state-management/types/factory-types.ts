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
import { IGraphQLQueryArgs, IGraphQLQueryListResponse } from "../../utils/graphql-api";
import { companyGroupTypes } from "../../data-model/company/company";


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
    graphqlEndCursor?: string;
}

/** action */

export interface IObjectRestApiReduxFactoryActions<ObjectSchema>  {
    [crudType: string]: {
        [RequestStatus.TRIGGERED]: {
            actionTypeName: string;
            action:
                (args:IObjectTriggerActionArgs<ObjectSchema>) => IObjectAction<ObjectSchema>;
            saga?: () => SagaIterator;
        };

        [RequestStatus.REQUESTING]: {
            actionTypeName: string;
            action: () => IObjectAction<ObjectSchema>;
            saga?: () => SagaIterator;
        };

        [RequestStatus.SUCCESS]: {
            actionTypeName: string;
            action(args: IObjectSuccessActionArgs<ObjectSchema>): IObjectAction<ObjectSchema>;
            saga?: () => SagaIterator;
        };

        [RequestStatus.FAILURE]: {
            actionTypeName: string;
            action: (error: any) => IObjectAction<ObjectSchema>;
            saga?: () => SagaIterator;
        };
    };
};

// TODO: may have separate typing for each TRIGGER, SUCCCESS, ... action in the future
export type IObjectAction<Schema> = IObjectBaseAction<Schema>;

export interface IObjectBaseAction<Schema> extends Action {
    type: string;
    crudType: CrudType;

    // below are only for TRIGGER actions
    //
    // for saga to perform additional side effect e.g. navigation
    successCallback?: Function;
    failureCallback?: (error: any) => void;
    finalCallback?: Function;
    // for deleteAction or other actions to obtain the original instance obj passed into trigger action
    triggerFormData?: TObject<Schema> | Array<TObject<Schema>> | Array<IReference> |
        IObjectBase | Array<IObjectBase>;
    // for customized api call
    absoluteUrl?: string;
    // for graphql API
    graphqlFunctionName?: string;
    graphqlArgs?: IGraphQLQueryArgs;
    // misc options that when dispatch action can pass additional parameters
    triggerActionOptions?: ITriggerActionOptions<Schema>

    // below are only for SUCCESS actions
    //
    graphqlEndCursor?: string;

    // below are only for DELETE-SUCCESS action
    //
    clearAll?: boolean;

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

export interface IObjectTriggerActionArgs<ObjectSchema> {
    objectClassInstance?: ObjectSchema |
        // used by GroupedCompanyActionCreators
        IObjectBase,
    successCallback?: (jsonResponse: JsonResponseType<ObjectSchema>) => void,
    failureCallback?: (error: any) => void,
    finalCallback?: Function,
    absoluteUrl?: string,
    triggerActionOptions?: ITriggerActionOptions<ObjectSchema>

    // if specified, use graphql client instead of rest api client for fetching
    graphqlFunctionName?: string;
    graphqlArgs?: IGraphQLQueryArgs;
}

export type IObjectSuccessActionArgs<ObjectSchema> = IObjectSuccessActionArgsBase<ObjectSchema>;

interface IObjectSuccessActionArgsBase<ObjectSchema> {
    jsonResponse?:
        ObjectRestApiJsonResponse<ObjectSchema> |
        // used by GroupedCompanyActionCreators
        IObjectBase |
        // used by batch operation e.g. `BATCHCREATE`, `BATCHUPDATE`
        Array<IObjectBase> |
        // used by GroupedCompanyActionCreators
        { results: Array<ObjectSchema> | Array<IObjectBase>};

    triggerFormData?: TObject<ObjectSchema> | Array<TObject<ObjectSchema>> |
        // used by GroupedCompanyActionCreators (DELETE, ...)
        IObjectBase |
        // used by batch delete (see `select-company-saga.ts`)
        Array<IObjectBase> |
        // used by GroupedCompanyActionCreators
        string[];

    graphqlEndCursor?: string

    // only for DELETE
    clearAll?: boolean
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
    data?: Array<TObject<Schema>> | TObject<Schema>;
    updateFromObject?: TObject<Schema>;
    graphqlEndCursor?: string;
    clearPreviousCollection?: boolean;
    
    // only apply for grouped company's saga
    companyGroupType?: companyGroupTypes;
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
    clearPreviousCollection?: boolean;
}
