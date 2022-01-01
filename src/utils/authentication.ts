import { RestApiService } from "./rest-api";
import { BaseModel, IBaseModelProps } from "../data-model/base-model";

import { RequestedLoginMode, RequestedLoginAuthActionParams } from "../state-management/types/auth-types";

export interface ILoginObjectProps {
    code?: string;
    provider?: string;
    redirect_uri?: string;
}

export interface IRefreshObjectProps {
    token: string;
}

class RefreshObject extends BaseModel {
    refresh: string;

    constructor({
        token = "",
        ...args
    }: IRefreshObjectProps & IBaseModelProps) {
        super(args);
        this.refresh = token;
    }
}

interface IRefreshResponse {
    access: string;
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

interface ISocialJWTLoginResponse {
    token: string;
    refresh: string;
    first_name: string;
    last_name: string;
    email: string;
    avatar_url: string
}

interface IJWTLoginResponse {
    access: string;
    refresh: string;
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
        apiRefreshToken: ``,
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
                this.apiCallTokenRefresher = sessionAuthState.apiTokenRefresher;

                try {
                    const refreshTokenReponse: IRefreshResponse = await this.refreshToken();

                    return {
                        email: sessionAuthState.userName,
                        token: refreshTokenReponse.access,
                        refresh: this.apiCallTokenRefresher, // unchanged if backend doesn't rotate refresh token
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
                const resp: ISocialJWTLoginResponse = await RestApiService.post<LoginObject>({
                    data: loginObject,
                    endpointUrl: this.state.apiSocialLoginUrl
                });

                this.apiCallToken = resp.token;
                this.apiCallTokenRefresher = resp.refresh;

                return {
                    ...resp,
                    isLocal: false
                };
            }
            catch (error) {
                throw new Error(error);
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
                    throw new Error(res.statusText);
                }

                const parsedJsonResponse: IJWTLoginResponse = await res.json();

                this.apiCallToken = parsedJsonResponse.access;
                this.apiCallTokenRefresher = parsedJsonResponse.refresh;

                return {
                    email: params.username,
                    token: parsedJsonResponse.access,
                    refresh: parsedJsonResponse.refresh,
                    avatar_url: "",
                    isLocal: true
                }
            }
            catch (error) {
                throw new Error(error);
            }
        }
    };

    get apiCallToken() {
        return this.state.apiLoginToken;
    }

    set apiCallToken(token) {
        this.state.apiLoginToken = token;
    }

    get apiCallTokenRefresher() {
        return this.state.apiRefreshToken;
    }

    set apiCallTokenRefresher(refreshToken) {
        this.state.apiRefreshToken = refreshToken;
    }

    refreshToken = async () => {
        const refreshObject = new RefreshObject({
            token: this.apiCallTokenRefresher
        });
        try {
            const resp: IRefreshResponse = await RestApiService.post<RefreshObject>({
                data: refreshObject,
                endpointUrl: this.state.apiLoginRefreshUrl
            });

            // only update access token, no need to update `this.apiCallTokenRefresher`
            // because backend does not rotate refresher
            this.apiCallToken = resp.access;

            return resp;
        } catch (error) {
            throw new Error(error);
        }
    };

    serverLogout = async () => {
        // no server-side invalidate implement at this point (a common case for JWT, however)

        this.apiCallToken = "";
        this.apiCallTokenRefresher = "";

        // will let saga dispatch logout to reset authState in session storage

        return;
    };
}

export const AuthenticationService = new Authentication();
