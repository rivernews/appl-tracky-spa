import { RestApiService } from "./rest-api";
import { BaseModel, IBaseModelProps } from "../store/data-model/base-model";

export interface ILoginObjectProps {
    code?: string
    provider?: string
    redirect_uri?: string
}

export interface IRefreshObjectProps {
    token: string
}

class RefreshObject extends BaseModel {
    token: string

    constructor({
        token = "",
        ...args
    }: IRefreshObjectProps & IBaseModelProps) {
        super(args);
        this.token = token;
    }
}

class LoginObject extends BaseModel {
    code: string
    provider: string
    redirect_uri: string

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

        userEmail: ``,
        apiLoginToken: ``,
        userFirstName: ``,
        userLastName: ``,

        objectID: ``
    };

    serverLogin = (socialLoginCode: string) => {
        let loginObject = new LoginObject({
            code: socialLoginCode,
            provider: this.state.socialAuthProvider,
            redirect_uri: this.state.redirectUri
        })
        return RestApiService
            .post<LoginObject>({
                data: loginObject,
                endpointUrl: this.state.apiSocialLoginUrl
            })
    }

    get apiCallToken() {
        return this.state.apiLoginToken;
    }

    set apiCallToken(token) {
        this.state.apiLoginToken = token;
    }

    private refreshToken = () => {
        let refreshObject = new RefreshObject({
            token: this.state.apiLoginToken,
        })
        return RestApiService
            .post<RefreshObject>({
                data: refreshObject,
                endpointUrl: this.state.apiLoginRefreshUrl
            })
    }

    serverLogout = async () => {
        console.log("server logout...");
        // no server-side invalidate implement at this point (a common case for JWT, however)
        this.state.userEmail = "";
        this.state.userFirstName = ""
        this.state.userLastName = ""
        this.state.apiLoginToken = "";
        return;
    }
}

export const AuthenticationService = new Authentication();