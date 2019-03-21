export enum RequestStatus {
    REQUESTING = "requesting",
    SUCCESS = "success",
    FAILURE = "failre"
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

    apiGet = ({ endpointUrl }: { endpointUrl: string }) => {
        return fetch(`${this.state.apiBaseUrl}${endpointUrl}`, {
            method: "GET",
            ...this.setApiAuthHeaders()
        }).then(res => res.json());
    }

    apiPost = ({
        data,
        endpointUrl
    }: {
        data: object;
        endpointUrl: string;
    }) => {
        return fetch(`${this.state.apiBaseUrl}${endpointUrl}`, {
            method: "POST",
            ...this.setApiAuthHeaders(),
            body: JSON.stringify(data)
        }).then(res => res.json());
        // let caller handle error in their own .catch()
    };

    setApiAuthHeaders = (): RequestInit => {
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
export const restApi = new RestApi();