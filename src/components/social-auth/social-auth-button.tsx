import React, { Component } from "react";
import { RouteComponentProps, withRouter } from "react-router-dom";

/** Redux */
import { Dispatch } from "redux";
import { connect } from "react-redux";
import { IRootState } from "../../store/types";
import { IUpdateAuthAction, IRequestedLoginAuthAction, TAuthActions, IUpdateAuthState } from "../../store/auth/types";
import { UpdateAuth, RequestedLoginAuth, RequestedLogoutAuth } from "../../store/auth/actions";

/** Components */
import { SocialAuthLoginButton } from "./social-auth-login-button";
import { SocialAuthLogoutButton } from "./social-auth-logout-button";

interface ISocialAuthButtonProps extends RouteComponentProps {
    auth: IUpdateAuthState;
    requestedLoginAuth: (socialAuthToken: string) => void;
    requestedLogoutAuth: () => void;
}

class SocialAuthButton extends Component<
    ISocialAuthButtonProps
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
                // this.apiLogin();
                console.log("social button: request auth...");
                this.props.requestedLoginAuth(this.state.code);
            }
        );
    };

    onSocialLoginFailure = (error: any) => {
        console.error("Social login failed:", error);
    };

    onSocialLogoutSuccess = () => {
        console.log("Social logout success, now our web app logout");
        // this.setState({
        //     code: ``,
        //     userEmail: ``,
        //     apiLoginToken: ``,
        //     userFirstName: ``,
        //     userLastName: ``
        // });

        // this.props.updateAuth({
        //     isLogin: false,
        //     userName: "",
        //     apiToken: "",
        //     expireDateTime: ""
        // });
        // this.props.history.push("/");
        this.props.requestedLogoutAuth();
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
                auth requestStatus: {this.props.auth.requestStatus} <br></br>
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

function mapDispatchToProps(dispatch: Dispatch<TAuthActions>) {
    return {
        requestedLoginAuth: (socialAuthToken: string) => {
            dispatch(
                RequestedLoginAuth(socialAuthToken)
            );
        },
        requestedLogoutAuth: () => {
            dispatch(
                RequestedLogoutAuth()
            );
        }
    };
}

export const SocialAuthButtonContainer = withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(SocialAuthButton));
