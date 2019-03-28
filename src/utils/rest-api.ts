import { TObject, IObjectBase } from "../store/rest-api-redux-factory";

export enum RequestStatus {
    TRIGGERED = "triggered",
    REQUESTING = "requesting",
    SUCCESS = "success",
    FAILURE = "failre"
}

export enum CrudType {
    CREATE = "create",
    READ = "read",
    LIST = "list",
    UPDATE = "update",
    DELETE = "delete"
}

export enum RestMethod {
    POST = "post",
    GET = "get",
    PATCH = "patch",
    DELETE = "delete"
}

export const CrudMapToRest = (crudType: CrudType): RestMethod => {
    switch (crudType) {
        case CrudType.CREATE:
            return RestMethod.POST;
        case CrudType.READ:
            return RestMethod.GET;
        case CrudType.LIST:
            return RestMethod.GET;
        case CrudType.UPDATE:
            return RestMethod.PATCH;
        case CrudType.DELETE:
            return RestMethod.DELETE;

        default:
            return RestMethod.GET;
    }
};

interface IRequestParams {
    endpointUrl?: string;
    objectName?: string;
    data?: any;
}

export interface IListRestApiResponse<Schema> {
    count: number;
    next: any;
    previous: any;
    results: Array<TObject<Schema>>;
}

export type ISingleRestApiResponse<Schema> = TObject<Schema>;

export function IsSingleRestApiResponseTypeGuard<Schema>(
    response: ISingleRestApiResponse<Schema> | IListRestApiResponse<Schema>
): response is ISingleRestApiResponse<Schema> {
    return (<ISingleRestApiResponse<Schema>>response).uuid !== undefined;
}

export class RestApi {
    state = {
        clientID: `732988498848-vuhd6g61bnlqe372i3l5pbpnerteu6na.apps.googleusercontent.com`,
        code: ``,
        redirectUri: `postmessage`,
        apiBaseUrl: `http://localhost:8000/`,
        apiLoginUrl: `login/social/`,
        socialAuthProvider: `google-oauth2`,

        userEmail: ``,
        apiLoginToken: ``,
        userFirstName: ``,
        userLastName: ``,

        objectID: ``
    };

    get = ({ endpointUrl, objectName, data }: IRequestParams) => {
        return fetch(
            this.getRelativeUrl({
                endpointUrl,
                objectName,
                data
            }),
            {
                method: "GET",
                ...this.setApiAuthHeaders()
            }
        ).then(res => res.json());
    };

    post = ({ data, objectName, endpointUrl }: IRequestParams) => {
        console.log(`restapi:post fired`);
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

    patch = ({ data, objectName, endpointUrl }: IRequestParams) => {
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
        );
    };

    delete = ({ data, objectName, endpointUrl }: IRequestParams) => {
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
    private getRelativeUrl = ({
        objectName,
        data,
        endpointUrl
    }: IRequestParams) => {
        let url = "";
        if (endpointUrl) {
            url = `${this.state.apiBaseUrl}${endpointUrl}`;
        } else {
            url = `${this.state.apiBaseUrl}${objectName}/${
                data.id ? data.id + "/" : ""
            }`;
        }
        console.log(`restapi: url: ${url}, objname=${objectName}`);
        return url;
    };

    private setApiAuthHeaders = (): RequestInit => {

        console.log("api: set header: got credentials?", this.state.apiLoginToken);
        return {
            mode: "cors",
            credentials: this.state.apiLoginToken ? "include" : "omit",
            headers: {
                Authorization: this.state.apiLoginToken
                    ? `JWT ${this.state.apiLoginToken}`
                    : ``,
                "Content-Type": "application/json"
            }
        };
    };
}

/** create restapi singleton */
export const RestApiService = new RestApi();
