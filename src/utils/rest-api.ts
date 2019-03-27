export enum RequestStatus {
    TRIGGERED = "triggered",
    REQUESTING = "requesting",
    SUCCESS = "success",
    FAILURE = "failre"
}

export const CrudMapToRest: {
    [crudKeyword: string]: "post" | "get" | "patch" | "delete"
} = {
    CREATE: "post",
    READ: "get",
    LIST: "get",
    UPDATE: "patch",
    DELETE: "delete",
}

interface IRequestParams {
    endpointUrl?: string
    objectName?: string
    data?: any
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
    }

    get = ({ endpointUrl, objectName, data }: IRequestParams) => {
        return fetch(this.getRelativeUrl({
            endpointUrl, objectName, data
        }), {
            method: "GET",
            ...this.setApiAuthHeaders()
        }).then(res => res.json());
    }

    post = ({
        data,
        objectName,
        endpointUrl
    }: IRequestParams) => {
        return fetch(this.getRelativeUrl({
            endpointUrl, objectName, data
        }), {
            method: "POST",
            ...this.setApiAuthHeaders(),
            body: JSON.stringify(data)
        })
        .then(res => res.json());
        // let caller handle error in their own .catch()
    };

    patch = ({
        data,
        objectName,
        endpointUrl
    }: IRequestParams) => {
        return fetch(this.getRelativeUrl({
            endpointUrl, objectName, data
        }), {
            method: "PATCH",
            ...this.setApiAuthHeaders(),
            body: JSON.stringify(data)
        });
    }

    delete = ({
        data,
        objectName,
        endpointUrl
    }: IRequestParams) => {
        return fetch(this.getRelativeUrl({
            endpointUrl, objectName, data
        }), {
            method: "DELETE",
            ...this.setApiAuthHeaders(),
            body: JSON.stringify(data)
        });
    }

    /** helper */
    private getRelativeUrl = ({
        objectName,
        data,
        endpointUrl,
    }: IRequestParams) => {
        if (endpointUrl) {
            return `${this.state.apiBaseUrl}${endpointUrl}`;
        } 
        else {
            return `${this.state.apiBaseUrl}${objectName}/${(data.id) ? data.id + "/" : ""}`;
        }
    }

    private setApiAuthHeaders = (): RequestInit => {
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
    }
}

/** create restapi singleton */
export const RestApiService = new RestApi();