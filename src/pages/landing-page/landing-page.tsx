import React, { Component } from "react";
import { withRouter, RouteComponentProps, Redirect } from "react-router-dom";

/** Redux */
import { connect } from "react-redux";
import { Dispatch, AnyAction } from "redux";
import { IRootState } from "../../store/types";
import { IUpdateAuthState } from "../../store/auth/types";

/** Components */
import { SocialAuthButtonContainer } from "../../components/login/social-auth-button";
import MaterialIcon from "@material/react-material-icon";
// mdc react button
import "@material/react-button/dist/button.css";
import Button from "@material/react-button";


const styles = {
    backgroundColor: "purple",
    color: "white"
};

interface ILandingPageProps extends RouteComponentProps {
    auth: IUpdateAuthState;
}

class LandingPage extends Component<ILandingPageProps> {
    formFactoryProps: any;

    constructor(props: ILandingPageProps) {
        super(props);
    }

    onStaffLoginClick = () => {
        this.props.history.push("/local-login/");
    }

    render() {
        return (
            <div className="LandingPage" style={styles}>
                <h1>Appl Tracky</h1>

                <SocialAuthButtonContainer />

                <Button
                    onClick={this.onStaffLoginClick}
                    unelevated
                    icon={
                        <MaterialIcon hasRipple icon="warning" />
                    }
                >
                    Staff Only
                </Button>

                <hr />
                
                <Button
                    href="https://github.com/rivernews/appl-tracky-spa"
                    target="_blank"
                    unelevated
                    icon={
                        <MaterialIcon hasRipple icon="code" />
                    }
                >
                    Github Repository
                </Button>
            </div>
        );
    }
}

const mapStateToProps = (state: IRootState) => ({
    auth: state.auth
});

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) => {
    // actionName = (newState for that action & its type) => dispatch(ActionCreatorFunction(newState))
    return {
    };
};

export const LandingPageContainer = withRouter(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(LandingPage)
);
