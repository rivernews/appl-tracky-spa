import { restApi } from "./rest-api";

class Authentication {
    state = {
        clientID: `732988498848-vuhd6g61bnlqe372i3l5pbpnerteu6na.apps.googleusercontent.com`,

        redirectUri: `postmessage`,
        apiLoginUrl: `login/social/`,
        socialAuthProvider: `google-oauth2`,

        userEmail: ``,
        apiLoginToken: ``,
        userFirstName: ``,
        userLastName: ``,

        objectID: ``
    };

    serverLogin = (socialLoginCode: string) => {
        return restApi
            .apiPost({
                data: {
                    code: socialLoginCode,
                    provider: this.state.socialAuthProvider,
                    redirect_uri: this.state.redirectUri
                },
                endpointUrl: this.state.apiLoginUrl
            })
            .then(jsonData => {
                console.log("API login res:", JSON.stringify(jsonData));
                if (jsonData.email) {
                    console.log("API login success.");
                    this.state.userEmail = jsonData.email;
                    this.state.userFirstName = jsonData.userFirstName;
                    this.state.userLastName = jsonData.userLastName;
                    this.state.apiLoginToken = restApi.state.apiLoginToken = jsonData.apiLoginToken;
                } else {
                    console.warn("API login failure.");
                    return Error("API login failure.")
                }
            })
            .catch(error => {
                console.error("API login error:", error);
            });
    }

    socialLogout = () => {

    }

    serverLogout = () => {

    }
}

export const authentication = new Authentication();