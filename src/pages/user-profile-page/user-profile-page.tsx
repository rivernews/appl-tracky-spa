import React, { Component, Dispatch } from "react";

/** redux */
import { AnyAction } from "redux";
import { connect } from "react-redux";
import { IRootState } from "../../store/types";
import { IUpdateAuthState } from "../../store/auth/types";
import { RequestedLogoutAuth } from "../../store/auth/actions";

/** Routes & pages */
import { UserInfo } from "../../components/user-info/user-info";
import { withRouter, RouteComponentProps } from 'react-router-dom';

/** Components */
import "./user-profile-page.css"

import { SocialAuthButtonContainer } from "../../components/login/social-auth-button";
import { LocalLogoutButton } from "../../components/login/local-logout-button";


interface IUserProfilePageProps extends RouteComponentProps {
    /** redux store state */
    auth: IUpdateAuthState;

    /** action dispatcher */
    requestedLogoutAuth: () => void;
}

class UserProfilePage extends Component<IUserProfilePageProps, any> {
    localLogoutButton = () => {
        this.props.requestedLogoutAuth();
    }

    render() {
        return (
            <div className="UserProfilePage">
                <h1>{this.props.auth.userName}'s profile</h1>
                <div>
                    isLocal = {JSON.stringify(this.props.auth.isLocal)}
                </div>
                <UserInfo auth={this.props.auth} />
                {
                    !this.props.auth.isLocal ? (
                        <SocialAuthButtonContainer />
                    ) : (
                        <LocalLogoutButton 
                            onClick={this.localLogoutButton}
                        />
                    )
                }
            </div>
        );
    }
}

const mapStateToProps = (store: IRootState) => {
    return {
        auth: store.auth
    };
};

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) => { 
    return {
        requestedLogoutAuth: () => {
            dispatch(
                RequestedLogoutAuth()
            );
        },
    }
}

export const UserProfilePageContainer = withRouter(connect(mapStateToProps, mapDispatchToProps)(UserProfilePage));
