import React, { Component } from "react";

/** redux */
import { connect } from "react-redux";
import { IRootState } from "../../store/types";
import { IUpdateAuthState } from "../../store/auth/types";

/** Routes & pages */
import { UserInfo } from "../../components/user-info/user-info";
import { withRouter, RouteComponentProps } from 'react-router-dom';

/** Components */
import { SocialAuthButtonContainer } from "../../components/social-auth/social-auth-button";

interface IUserProfilePageProps extends RouteComponentProps {
    auth: IUpdateAuthState;
}

class UserProfilePage extends Component<IUserProfilePageProps, any> {
    render() {
        return (
            <div>
                <h1>My Profile</h1>
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
