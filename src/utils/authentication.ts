import { RestApiService } from "./rest-api";
import { BaseModel, IBaseModelProps } from "../store/data-model/base-model";

import { RequestedLoginMode, RequestedLoginAuthActionParams } from "../store/auth/types";

export interface ILoginObjectProps {
    code?: string;
    provider?: string;
    redirect_uri?: string;
}

export interface IRefreshObjectProps {
    token: string;
}

class RefreshObject extends BaseModel {
    token: string;

    constructor({
        token = "",
        ...args
    }: IRefreshObjectProps & IBaseModelProps) {
        super(args);
        this.token = token;
    }
}

class LoginObject extends BaseModel {
    code: string;
    provider: string;
    redirect_uri: string;

    constructor({
        code = "",
        provider = "",
        redirect_uri = "",
        ...args
    }: ILoginObjectProps & IBaseModelProps) {
        super(args);
        this.code = code;
        this.provider = provider;
        this.redirect_uri = redirect_uri;
    }
}

class Authentication {
    state = {
        clientID: `732988498848-vuhd6g61bnlqe372i3l5pbpnerteu6na.apps.googleusercontent.com`,
        redirectUri: `postmessage`,
        apiSocialLoginUrl: `login/social/`,
        apiLocalLoginUrl: `api-token-auth/`,
        apiLoginRefreshUrl: `api-token-refresh/`,
        socialAuthProvider: `google-oauth2`,

        apiLoginToken: ``,
    };

    serverLogin = async (loginMode: RequestedLoginMode, params: RequestedLoginAuthActionParams) => {
        // prefill login
        if (loginMode === RequestedLoginMode.PREFILL) {
            // restore session login data
            const sessionAuthState = localStorage.getItem(`${(process.env.NODE_ENV === "development") ? "dev__" : ""}applyTracky__authState`)
                ? JSON.parse(localStorage.getItem(`${(process.env.NODE_ENV === "development") ? "dev__" : ""}applyTracky__authState`) || "{}")
                : {};

            if (sessionAuthState.isLogin) {
                this.apiCallToken = sessionAuthState.apiToken;

                try {
                    const refreshTokenReponse = await this.refreshToken();

                    return {
                        email: sessionAuthState.userName,
                        token: refreshTokenReponse.token,
                        avatar_url: sessionAuthState.avatarUrl,
                        isLocal: sessionAuthState.isLocal
                    };
                } catch (error) {
                    // catch: refresh failed or data-fetching failed
                    process.env.NODE_ENV === "development" &&
                        console.error(
                            `Error after refreshing token in Authentication service: ${error}`
                        );
                }
            }
            
            // in case cannot restore login session,
            // will let saga dispatch logout to reset authState in session storage
            return {};
        }

        // social auth login
        else if (loginMode === RequestedLoginMode.SOCIAL_AUTH) {
            const loginObject = new LoginObject({
                code: params.socialAuthToken,
                provider: this.state.socialAuthProvider,
                redirect_uri: this.state.redirectUri
            });
    
            try {
                const resp = await RestApiService.post<LoginObject>({
                    data: loginObject,
                    endpointUrl: this.state.apiSocialLoginUrl
                });
    
                this.apiCallToken = resp.token;
                return {
                    ...resp,
                    isLocal: false
                };
            }
            catch (error) {
                throw Error(error);
            }
        }

        // local login
        else if (loginMode === RequestedLoginMode.LOCAL) {
            // post login form data to get login token
            try {
                const res = await fetch(`${RestApiService.state.apiBaseUrl}${this.state.apiLocalLoginUrl}`, {
                    method: "POST",
                    mode: "cors",
                    credentials: "omit",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        username: params.username, password: params.password
                    })
                });
    
                if (!res.ok) {
                    process.env.NODE_ENV === 'development' && console.log("INFO: server res =", res);
                    throw Error(res.statusText)
                }
    
                const parsedJsonResponse = await res.json();
                
                this.apiCallToken = parsedJsonResponse.token;
    
                return {
                    email: params.username,
                    token: parsedJsonResponse.token,
                    avatar_url: parsedJsonResponse.avatar_url,
                    isLocal: true
                }
            }
            catch (error) {
                throw Error(error)
            }
        }
    };

    get apiCallToken() {
        return this.state.apiLoginToken;
    }

    set apiCallToken(token) {
        this.state.apiLoginToken = token;
    }

    refreshToken = async () => {
        const refreshObject = new RefreshObject({
            token: this.apiCallToken
        });
        try {
            const resp = await RestApiService.post<RefreshObject>({
                data: refreshObject,
                endpointUrl: this.state.apiLoginRefreshUrl
            });

            this.apiCallToken = resp.token;

            return resp;
        } catch (error) {
            throw Error(error);
        }
    };

    serverLogout = async () => {
        process.env.NODE_ENV === "development" &&
            console.log("server logout...");
        
        // no server-side invalidate implement at this point (a common case for JWT, however)

        this.apiCallToken = "";
        
        // will let saga dispatch logout to reset authState in session storage
        
        return;
    };
}

export const AuthenticationService = new Authentication();
