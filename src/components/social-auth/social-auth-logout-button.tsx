import React, { Component } from "react";

/** Components */
import { GoogleLogout } from "react-google-login";
// mdc react icon
import MaterialIcon from "@material/react-material-icon";
// mdc react button
import "@material/react-button/dist/button.css";
import Button from "@material/react-button";

interface ISocialAuthLogoutButtonProps {
    isLocal: boolean
    onClickWhenIsLocal?(): void
    onSuccess(authResponse?: any): void;
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
                    render={(renderProps: any) => (
                        <Button
                            onClick={(this.props.isLocal) ? this.props.onClickWhenIsLocal : renderProps.onClick}
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
