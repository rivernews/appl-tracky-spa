import React, { Component } from "react";

/** Components */
import { GoogleLogin } from "react-google-login";
// mdc react icon
import MaterialIcon from "@material/react-material-icon";
// mdc react button
import "@material/react-button/dist/button.css";
import Button from "@material/react-button";
// font awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGoogle } from '@fortawesome/free-brands-svg-icons'

interface ISocialAuthLoginButtonProps {
    clientID: string;
    redirectUri?: string;
    onSuccess(authResponse?: any): void;
    onFailure?(error: any): void;
    disabled?: boolean;
}

export class SocialAuthLoginButton extends Component<
    ISocialAuthLoginButtonProps
> {
    onLoginButtonClicked = (clickEvent: any, renderProps: any) => {
        process.env.NODE_ENV === 'development' && console.log("login button clicked", clickEvent, renderProps);
        renderProps.onClick(clickEvent);
    };

    onAuthSuccess = (authResponse?: any) => {
        process.env.NODE_ENV === 'development' && console.log("login button auth success");
        this.props.onSuccess(authResponse);
    };

    onAuthFailure = (error: any) => {
        process.env.NODE_ENV === 'development' && console.log("login button auth failed");
        if (this.props.onFailure) {
            this.props.onFailure(error);
        }
    };

    render() {
        return (
            <div className="UserAuthButton">
                <GoogleLogin
                    render={(renderProps: any) => (
                        <Button
                            onClick={clickEvent =>
                                this.onLoginButtonClicked(
                                    clickEvent,
                                    renderProps
                                )
                            }
                            unelevated
                            icon={
                                // <MaterialIcon hasRipple icon="account_circle" />
                                <FontAwesomeIcon icon={faGoogle} />
                            }
                            disabled={this.props.disabled}
                        >
                            Google Login
                        </Button>
                    )}
                    onSuccess={this.onAuthSuccess}
                    onFailure={this.onAuthFailure}
                    clientId={this.props.clientID}
                    responseType="code"
                    redirectUri={this.props.redirectUri || "postmessage"}
                />
            </div>
        );
    }
}
