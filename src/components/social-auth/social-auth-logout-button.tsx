import React, { Component } from "react";

/** Components */
import { GoogleLogout } from "react-google-login";
// mdc react icon
import MaterialIcon from "@material/react-material-icon";
// mdc react button
import "@material/react-button/dist/button.css";
import Button from "@material/react-button";

interface ISocialAuthLogoutButtonProps {
    onSuccess(authResponse?: any): void;
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
                    render={(renderProps: any) => (
                        <Button
                            onClick={renderProps.onClick}
                            unelevated
                            icon={<MaterialIcon hasRipple icon="eject" />}
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
