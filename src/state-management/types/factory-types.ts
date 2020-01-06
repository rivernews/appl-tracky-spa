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
