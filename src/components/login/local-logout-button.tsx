import React from "react";

/** Components */
// mdc react icon
import MaterialIcon from "@material/react-material-icon";
// mdc react button
import "@material/react-button/dist/button.css";
import Button from "@material/react-button";

interface ILocalLogoutButtonProps {
    onClick: () => void;
    disabled?: boolean;
}

const LocalLogoutButton = (props: ILocalLogoutButtonProps) => {
    return (
        <div className="UserAuthButton">
            <Button
                onClick={props.onClick}
                unelevated
                icon={
                    <MaterialIcon icon="account_circle" />
                }
                disabled={props.disabled}
            >
                Local Logout
                    </Button>
        </div>
    );
}

export {
    LocalLogoutButton
};