import { TObject } from "../state-management/types/factory-types";
import { AuthenticationService } from "./authentication";


export enum RequestStatus {
    TRIGGERED = "triggered",
    REQUESTING = "requesting",
    SUCCESS = "success",
    FAILURE = "failre"
}

export enum CrudType {
    CREATE = "create",
    BATCHCREATE = "batchcreate",
    READ = "read",
    LIST = "list",
    UPDATE = "update",
    BATCHUPDATE = "batchupdate",
    // DELETE includes indivual delete and batch delete
    DELETE = "delete",
}

export const CrudKeywords = Object.values(CrudType) as Array<CrudType>;

export enum RestMethod {
    POST = "post",
    GET = "get",
    PATCH = "patch",
    DELETE = "delete"
}

export const CrudMapToRest = (crudType: CrudType): RestMethod => {
    switch (crudType) {
        case CrudType.CREATE:
        case CrudType.BATCHCREATE:
            return RestMethod.POST;
        case CrudType.READ:
            return RestMethod.GET;
        case CrudType.LIST:
            return RestMethod.GET;
        case CrudType.UPDATE:
        case CrudType.BATCHUPDATE:
            return RestMethod.PATCH;
        // DELETE includes indivual delete and batch delete
        case CrudType.DELETE:
            return RestMethod.DELETE;

        default:
            return RestMethod.GET;
    }
};

export interface IRequestParams<Schema> {
    endpointUrl?: string;
    absoluteUrl?: string;
    objectName?: string;
    data?: TObject<Schema> | Array<TObject<Schema>>;
}

export interface IListRestApiResponse<Schema> {
    count: number;
    next: string;
    previous: string;
    results: Array<TObject<Schema>>;
}

export type ISingleRestApiResponse<Schema> = TObject<Schema>;

export function IsSingleRestApiResponseTypeGuard<Schema>(
    response: ISingleRestApiResponse<Schema> | IListRestApiResponse<Schema> |
        // used by GroupedCompanyActionCreators
        { uuid: string }
): response is ISingleRestApiResponse<Schema> {
    return (<ISingleRestApiResponse<Schema>>response).uuid !== undefined;
}

function IsSingleFormDataTypeGuard<Schema>(
    formData: TObject<Schema> | Array<TObject<Schema>>
): formData is TObject<Schema> {
    return (<TObject<Schema>>formData).uuid !== undefined;
}

export class RestApi {
    state = {
        clientID: `732988498848-vuhd6g61bnlqe372i3l5pbpnerteu6na.apps.googleusercontent.com`,
        code: ``,
        redirectUri: `postmessage`,
        apiBaseUrl: (process.env.NODE_ENV === 'development') ? 
        `http://localhost:8000/api/`
        :
        `https://appl-tracky.api.shaungc.com/api/`
        ,
        socialAuthProvider: `google-oauth2`,

        userEmail: ``,
        userFirstName: ``,
        userLastName: ``,

        objectID: ``
    };

    get = <Schema>({ endpointUrl, absoluteUrl, objectName, data }: IRequestParams<Schema>) => {
        return fetch(
            this.getRelativeUrl({
                endpointUrl,
                absoluteUrl,
                objectName,
                data
            }),
            {
                method: "GET",
                ...this.setApiAuthHeaders()
            }
        ).then(res => res.json());
    };

    post = <Schema>({ data, objectName, endpointUrl }: IRequestParams<Schema>) => {
        return fetch(
            this.getRelativeUrl({
                endpointUrl,
                objectName,
                data
            }),
            {
                method: "POST",
                ...this.setApiAuthHeaders(),
                body: JSON.stringify(data)
            }
        ).then(res => res.json());
        // let caller handle error in their own .catch()
    };

    patch = <Schema>({ data, objectName, endpointUrl }: IRequestParams<Schema>) => {
        return fetch(
            this.getRelativeUrl({
                endpointUrl,
                objectName,
                data
            }),
            {
                method: "PATCH",
                ...this.setApiAuthHeaders(),
                body: JSON.stringify(data)
            }
        ).then(res => res.json());
    };

    delete = <Schema>({ data, objectName, endpointUrl }: IRequestParams<Schema>) => {
        return fetch(
            this.getRelativeUrl({
                endpointUrl,
                objectName,
                data
            }),
            {
                method: "DELETE",
                ...this.setApiAuthHeaders(),
                body: JSON.stringify(data)
            }
        );
    };

    /** helper */
    private getRelativeUrl = <Schema>({
        objectName,
        data,
        endpointUrl,
        absoluteUrl,
    }: IRequestParams<Schema>) => {
        let url = "";
        if (absoluteUrl) {
            url = absoluteUrl;
        }
        else if (endpointUrl) {
            url = `${this.state.apiBaseUrl}${endpointUrl}`;
        } else {
            if (data && IsSingleFormDataTypeGuard(data) && data.uuid) {
                url = `${this.state.apiBaseUrl}${objectName}/${data.uuid}/`;
            } else {
                url = `${this.state.apiBaseUrl}${objectName}/`;
            }
        }
        return url;
    };

    private setApiAuthHeaders = (): RequestInit => {

        return {
            mode: "cors",
            credentials: AuthenticationService.apiCallToken ? "include" : "omit",
            headers: {
                Authorization: AuthenticationService.apiCallToken
                    ? `JWT ${AuthenticationService.apiCallToken}`
                    : ``,
                "Content-Type": "application/json"
            }
        };
    };
}

/** create restapi singleton */
export const RestApiService = new RestApi();
