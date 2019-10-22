import React, { Component } from "react";

import { AuthenticationService } from "../../utils/authentication";

/** Components */
import { GoogleLogout } from "react-google-login";
// mdc react icon
import MaterialIcon from "@material/react-material-icon";
// mdc react button
import "@material/react-button/dist/button.css";
import Button from "@material/react-button";


interface ISocialAuthLogoutButtonProps {
    onSuccess(authResponse?: any): void;
    onClick: () => void
    disabled?: boolean
}

export class SocialAuthLogoutButton extends Component<
    ISocialAuthLogoutButtonProps
> {
    onAuthSuccess = (authResponse?: any) => {
        this.props.onSuccess(authResponse);
    };

    render() {
        return (
            <div className="UserAuthButton">
                <GoogleLogout
                    clientId={AuthenticationService.state.clientID}
                    render={(renderProps: any) => (
                        <Button
                            onClick={this.props.onClick}
                            unelevated
                            icon={<MaterialIcon hasRipple icon="eject" />}
                            disabled={this.props.disabled}
                        >
                            Logout
                        </Button>
                    )}
                    onLogoutSuccess={this.onAuthSuccess}
                />
            </div>
        );
    }
}
