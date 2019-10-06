import React, { Component } from "react";
import { withRouter, RouteComponentProps, Redirect } from "react-router-dom";

/** Redux */
import { connect } from "react-redux";
import { Dispatch, AnyAction } from "redux";
import { IRootState } from "../../store/types";
import { IUpdateAuthState } from "../../store/auth/types";
import { SuccessLoginAuth } from "../../store/auth/actions";
import { CompanyActions, Company } from "../../store/data-model/company";
import { ApplicationStatus, ApplicationStatusActions } from "../../store/data-model/application-status";
import {
    ApplicationActions,
    Application
} from "../../store/data-model/application";
import { CrudType, RequestStatus } from "../../utils/rest-api";

import { LoginForm } from "../../components/social-auth/login-form";
// mdc react button
import "@material/react-button/dist/button.css";



interface ILocalLoginPageProps extends RouteComponentProps {
    /** redux */
    auth: IUpdateAuthState;
    registerLocalLoginSuccess: (userName: string, apiToken: string, avatarUrl: string) => void;
    listApplication: () => void
    listCompany: () => void
    listApplicationStatus: () => void
}

class LocalLoginPage extends Component<ILocalLoginPageProps> {

    onLoginFormCancel = () => {
        this.props.history.push("/");
    }

    onLoginSuccess = () => {
        // request com & app list (dispatch)
        this.props.listApplication();
        this.props.listCompany();
        this.props.listApplicationStatus();
    }

    render() {
        return (
            <div className="LocalLoginPage">
                {/** redirect logged in user to private routes */
                this.props.auth.isLogin && <Redirect to="/home/" />}

                <h1>Login Portal for Staff</h1>
                <LoginForm 
                    registerLoginSuccess={this.props.registerLocalLoginSuccess}
                    onLoginSuccess={this.onLoginSuccess}
                    onCancel={this.onLoginFormCancel}
                />
            </div>
        )
    }
}

const mapStateToProps = (store: IRootState) => ({
    auth: store.auth
});

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) => {
    // actionName: (newState for that action & its type) => dispatch(ActionCreatorFunction(newState))
    return {
        registerLocalLoginSuccess: (userName: string, apiToken: string, avatarUrl: string) =>
            dispatch(SuccessLoginAuth(userName, "", apiToken, avatarUrl, true)),
        listApplication: () =>
            dispatch(
                ApplicationActions[CrudType.LIST][
                    RequestStatus.TRIGGERED
                ].action(new Application({}))
            ),
        listCompany: () =>
            dispatch(
                CompanyActions[CrudType.LIST][
                    RequestStatus.TRIGGERED
                ].action(new Company({}))
            ),
        listApplicationStatus: () =>
            dispatch(
                ApplicationStatusActions[CrudType.LIST][
                    RequestStatus.TRIGGERED
                ].action(new ApplicationStatus({}))
            )
    }
};

export const LocalLoginPageContainer = withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(LocalLoginPage));
