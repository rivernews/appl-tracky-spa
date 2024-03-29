import React, { Component } from "react";
import { RouteComponentProps, withRouter } from "react-router-dom";

/** Redux */
import { Dispatch } from "redux";
import { connect } from "react-redux";
import { IRootState } from "../../state-management/types/root-types";
import { TAuthActions, IUpdateAuthState, RequestedLoginMode } from "../../state-management/types/auth-types";
import { RequestedLoginAuth, RequestedLogoutAuth } from "../../state-management/action-creators/auth-actions";

/** rest api */
import { RequestStatus } from "../../utils/rest-api";

/** Components */
import { SocialAuthLoginButton } from "./social-auth-login-button";
import { SocialAuthLogoutButton } from "./social-auth-logout-button";

interface ISocialAuthButtonProps extends RouteComponentProps {
    auth: IUpdateAuthState;
    buttonType: SocialAuthButtonType;
    requestedLoginAuth: (socialAuthToken: string) => void;
    requestedLogoutAuth: () => void;
}

export enum SocialAuthButtonType {
    LOGIN = "login",
    LOGOUT = "logout"
}

class SocialAuthButton extends Component<
    ISocialAuthButtonProps
> {
    state = {
        clientID: `732988498848-vuhd6g61bnlqe372i3l5pbpnerteu6na.apps.googleusercontent.com`,
    };

    onSocialLoginSuccess = (googleOauthResponse: any) => {
        // get `code` from social login button, then obtain token from django server
        this.props.requestedLoginAuth(googleOauthResponse.code);
    };

    onSocialLoginFailure = (error: any) => {
        console.error("Social login failed:", error);
    };

    onSocialLogoutSuccess = () => {
        this.props.requestedLogoutAuth();
    };

    render() {
        return (
            <div className="SocialAuth">
                {this.props.buttonType === SocialAuthButtonType.LOGIN ? (
                    <SocialAuthLoginButton
                        clientID={this.state.clientID}
                        onSuccess={this.onSocialLoginSuccess}
                        onFailure={this.onSocialLoginFailure}
                        disabled={this.props.auth.requestStatus === RequestStatus.REQUESTING}
                    />
                ) :
                this.props.buttonType === SocialAuthButtonType.LOGOUT ? (
                    <SocialAuthLogoutButton
                        onSuccess={this.onSocialLogoutSuccess}
                        onClick={this.onSocialLogoutSuccess}

                        // TODO: logout - ideally no need to wait for request status, just interrupt existing requests (actually this should be possible by looking at `axios` and its abort request feature, or the native javascript `AbortController` and its `AbortController.abort()`).
                        // However, we'll have to cancel those ongoing sagas for data fetching
                        // disabled={this.props.auth.requestStatus === RequestStatus.REQUESTING}
                    />
                ) : (
                    <></>
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
