import React, { Component } from "react";
import { withRouter, RouteComponentProps } from "react-router-dom";

/** Redux */
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { IRootState } from "../../store/types";
import { IUpdateAuthState } from "../../store/auth/types";

/** Components */
import { SocialAuthButtonContainer } from "../../components/social-auth/social-auth-button";

let styles = {
    backgroundColor: "purple",
    color: "white"
};

interface ILandingPageProps extends RouteComponentProps {
    auth: IUpdateAuthState;
}

class LandingPage extends Component<ILandingPageProps> {
    render() {
        return (
            <div className="LandingPage" style={styles}>
                <h1>LandingPage Works!</h1>
                <SocialAuthButtonContainer />
            </div>
        );
    }
}

const mapStateToProps = (state: IRootState) => ({
    // prop: state.prop
    auth: state.auth
});

const mapDispatchToProps = {
    // actionName = (newState for that action & its type) => dispatch(ActionCreatorFunction(newState))
};

export const LandingPageContainer = withRouter(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(LandingPage)
);
