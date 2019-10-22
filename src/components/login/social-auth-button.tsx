import React, { Component } from "react";
import { RouteComponentProps, withRouter } from "react-router-dom";

/** Redux */
import { Dispatch } from "redux";
import { connect } from "react-redux";
import { IRootState } from "../../store/types";
import { IUpdateAuthAction, IRequestedLoginAuthAction, TAuthActions, IUpdateAuthState, RequestedLoginMode } from "../../store/auth/types";
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
        
        code: ``, // get `code` from social login button, then obtain token from django server
        apiLoginToken: ``,

        userEmail: ``,
        userFirstName: ``,
        userLastName: ``,

        objectID: ``
    };

    onSocialLoginSuccess = (googleOauthResponse: any) => {
        process.env.NODE_ENV === 'development' && console.log("Google Oauth2 res:", googleOauthResponse);
        this.setState(
            {
                code: googleOauthResponse.code
            },
            () => {
                // this.apiLogin();
                process.env.NODE_ENV === 'development' && console.log("social button: request auth...");
                this.props.requestedLoginAuth(this.state.code);
            }
        );
    };

    onSocialLoginFailure = (error: any) => {
        console.error("Social login failed:", error);
    };

    onSocialLogoutSuccess = () => {
        process.env.NODE_ENV === 'development' && console.log("Social logout success, now our web app logout");
        this.props.requestedLogoutAuth();
    };

    render() {
        return (
            <div className="SocialAuth">
                {!this.props.auth.isLogin ? (
                    <SocialAuthLoginButton
                        clientID={this.state.clientID}
                        onSuccess={this.onSocialLoginSuccess}
                        onFailure={this.onSocialLoginFailure}
                        disabled={this.props.auth.requestStatus === RequestStatus.REQUESTING}
                    />
                ) : (
                    <SocialAuthLogoutButton
                        onSuccess={this.onSocialLogoutSuccess}
                        onClick={this.onSocialLogoutSuccess}
                        // TODO: logout - ideally no need to wait for request status, just interrupt existing requests
                        // However, we'll have to cancel those ongoing sagas for data fetching
                        // disabled={this.props.auth.requestStatus === RequestStatus.REQUESTING}
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
                RequestedLoginAuth(RequestedLoginMode.SOCIAL_AUTH, {
                    socialAuthToken
                })
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
