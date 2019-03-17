import React, { Component } from "react";

/** redux */
import { connect } from "react-redux";
import { IRootState } from "../../store/types";
import { IAuthState } from "../../store/auth/types";

/** Routes & pages */
import { UserInfo } from "../../components/user-info/user-info";

/** Components */
import { GoogleLogout } from "react-google-login";
import SocialAuthButtonContainer from "../../components/social-auth/social-auth-button-container";
// mdc react
import "@material/react-button/dist/button.css";
import MaterialIcon from "@material/react-material-icon";
import Button from "@material/react-button";

interface IUserProfilePageProps {
    auth: IAuthState;
}

class UserProfilePage extends Component<IUserProfilePageProps, any> {
    render() {
        return (
            <div>
                <h1>(Internal Page) User Profile Page works!</h1>
                <UserInfo auth={this.props.auth} />
                <SocialAuthButtonContainer />
            </div>
        );
    }
}

const mapStateToProps = (store: IRootState) => {
    return {
        auth: store.auth
    };
};

export default connect(mapStateToProps)(UserProfilePage);
