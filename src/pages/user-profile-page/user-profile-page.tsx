import React, { Component } from "react";

/** redux */
import { connect } from "react-redux";
import { IRootState } from "../../store/types";
import { IAuthState } from "../../store/auth/types";

/** Routes & pages */
import { UserInfo } from "../../components/user-info/user-info";
import { withRouter } from 'react-router-dom';

/** Components */
import { SocialAuthButtonContainer } from "../../components/social-auth/social-auth-button";

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

export const UserProfilePageContainer = withRouter(connect(mapStateToProps)(UserProfilePage));
