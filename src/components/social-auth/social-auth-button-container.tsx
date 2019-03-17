import React, { Component } from "react";

/** Redux */
import { Dispatch } from "redux";
import { connect } from "react-redux";
import { IRootState } from "../../store/types";
import { IUpdateAuthAction, IAuthState } from "../../store/auth/types";
import { UpdateAuth } from "../../store/auth/actions";

/** Components */
import { GoogleLogin } from "react-google-login";
import { GoogleLogout } from "react-google-login";
import { SocialAuthLoginButton } from "./social-auth-login-button";
import { SocialAuthLogoutButton } from "./social-auth-logout-button";

interface ISocialAuthButtonContainerProps {
    auth: IAuthState;
    updateAuth: (newAuthState: IAuthState) => void;
}

class SocialAuthButtonContainer extends Component<
    ISocialAuthButtonContainerProps
> {
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

    onSocialLoginSuccess = (googleOauthResponse: any) => {
        console.log("Google Oauth2 res:", googleOauthResponse);
        this.setState(
            {
                code: googleOauthResponse.code
            },
            () => {
                this.apiLogin();
            }
        );
    };

    onSocialLoginFailure = (error: any) => {
        console.error("Social login failed:", error);
    };

    onSocialLogoutSuccess = () => {
        console.log("Logout success");
        this.setState({
            code: ``,
            userEmail: ``,
            apiLoginToken: ``,
            userFirstName: ``,
            userLastName: ``
        });
        this.props.updateAuth({
            isLogin: false,
            userName: "",
            token: "",
            expireDateTime: ""
        });
    };

    apiLogin = () => {
        this.apiPost({
            data: {
                code: this.state.code,
                provider: this.state.socialAuthProvider,
                redirect_uri: this.state.redirectUri
            },
            endpointUrl: this.state.apiLoginUrl
        })
            .then(jsonData => {
                console.log("API login res:", JSON.stringify(jsonData));
                if (jsonData.email) {
                    console.log("API login success.");
                    this.setState({
                        userEmail: jsonData.email,
                        userFirstName: jsonData.first_name,
                        userLastName: jsonData.last_name,
                        apiLoginToken: jsonData.token
                    });
                    this.props.updateAuth({
                        isLogin: true,
                        userName: `${jsonData.first_name} ${
                            jsonData.last_name
                        }`,
                        token: jsonData.token,
                        expireDateTime: ""
                    });
                } else {
                    console.warn("API login failure.");
                }
            })
            .catch(error => {
                console.error("API login error:", error);
            });
    };

    apiPost = ({
        data,
        endpointUrl
    }: {
        data: object;
        endpointUrl: string;
    }) => {
        return fetch(`${this.state.apiBaseUrl}${endpointUrl}`, {
            method: "POST",
            ...this.setApiLoginHeaders(),
            body: JSON.stringify(data)
        }).then(res => res.json());
        // let caller handle error in their own .catch()
    };

    apiGet = ({ endpointUrl }: { endpointUrl: string }) => {
        return fetch(`${this.state.apiBaseUrl}${endpointUrl}`, {
            method: "GET",
            ...this.setApiLoginHeaders()
        }).then(res => res.json());
    };

    apiDelete = ({
        modelEndpointUrl,
        objectID
    }: {
        modelEndpointUrl: string;
        objectID: string;
    }) => {
        return fetch(
            `${this.state.apiBaseUrl}${modelEndpointUrl}${objectID}/`,
            {
                method: "DELETE",
                ...this.setApiLoginHeaders()
            }
        );
        // delete does not respond anything
    };

    setApiLoginHeaders = (): RequestInit => {
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

    testReadPrivateData = () => {
        this.apiGet({ endpointUrl: "addresses/" })
            .then(jsonData => {
                console.log("Test res:", jsonData);
            })
            .catch(error => {
                console.error("Test fail:", error);
            });
    };

    testCreatePrivateData = () => {
        this.apiPost({
            data: {
                place_name: "my react created address!"
            },
            endpointUrl: "addresses/"
        })
            .then(jsonData => {
                console.log("Test res:", jsonData);
            })
            .catch(error => {
                console.error("Test fail:", error);
            });
    };

    testDeletePrivateData = () => {
        this.apiDelete({
            modelEndpointUrl: "addresses/",
            objectID: this.state.objectID
        })
            .then(jsonData => {
                console.log("Test res:", jsonData);
            })
            .catch(error => {
                console.error("Test fail:", error);
            });
    };

    render() {
        return (
            <div className="SocialAuth">
                {!this.props.auth.isLogin ? (
                    <SocialAuthLoginButton
                        clientID={this.state.clientID}
                        onSuccess={this.onSocialLoginSuccess}
                        onFailure={this.onSocialLoginFailure}
                    />
                ) : (
                    <SocialAuthLogoutButton
                        onSuccess={this.onSocialLogoutSuccess}
                    />
                )}
            </div>
        );
    }
}

const mapStateToProps = (store: IRootState) => {
    return {
        auth: store.auth
    };
};

function mapDispatchToProps(dispatch: Dispatch<IUpdateAuthAction>) {
    return {
        updateAuth: ({
            isLogin,
            userName,
            token,
            expireDateTime
        }: IAuthState) => {
            dispatch(
                UpdateAuth({
                    isLogin,
                    userName,
                    token,
                    expireDateTime
                })
            );
        }
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SocialAuthButtonContainer);
