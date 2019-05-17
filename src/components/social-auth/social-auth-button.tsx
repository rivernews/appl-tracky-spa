import React, { Component } from "react";
import { RouteComponentProps, withRouter } from "react-router-dom";

/** Redux */
import { Dispatch } from "redux";
import { connect } from "react-redux";
import { IRootState } from "../../store/types";
import { IUpdateAuthAction, IRequestedLoginAuthAction, TAuthActions, IUpdateAuthState } from "../../store/auth/types";
import { UpdateAuth, RequestedLoginAuth, RequestedLogoutAuth } from "../../store/auth/actions";

/** rest api */
import { RequestStatus } from "../../utils/rest-api";

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
        this.props.requestedLogoutAuth();
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
                        disabled={this.props.auth.requestStatus === RequestStatus.REQUESTING}
                    />
                ) : (
                    <SocialAuthLogoutButton
                        isLocal={this.props.auth.isLocal}

                        onClickWhenIsLocal={this.onSocialLogoutSuccess}
                        onSuccess={this.onSocialLogoutSuccess}
                        
                        disabled={this.props.auth.requestStatus === RequestStatus.REQUESTING}
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
