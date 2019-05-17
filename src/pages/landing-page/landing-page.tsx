import React, { Component } from "react";
import { withRouter, RouteComponentProps, Redirect } from "react-router-dom";

/** Redux */
import { connect } from "react-redux";
import { Dispatch, AnyAction } from "redux";
import { IRootState } from "../../store/types";
import { IUpdateAuthState } from "../../store/auth/types";
import { SuccessLoginAuth } from "../../store/auth/actions";
import { CompanyActions, Company } from "../../store/data-model/company";
import {
    ApplicationActions,
    Application
} from "../../store/data-model/application";
import { CrudType, RequestStatus } from "../../utils/rest-api";

/** Components */
import { SocialAuthButtonContainer } from "../../components/social-auth/social-auth-button";
// form
import {
    FormFactory,
    FormActionButtonProps,
    IFormFactoryProps,
    ActionButtonType
} from "../../components/form-factory/form-factory";
import { FormInputFieldMeta } from "../../components/form-factory/form-input-field/form-input-field-meta";
import { InputFieldType } from "../../components/form-factory/form-base-field/form-base-field-meta";
import { ErrorMessage, FormikValues, FormikErrors } from "formik";
    import { LoginForm } from "../../components/social-auth/login-form";
// api
import { AuthenticationService } from "../../utils/auth";
import { RestApiService } from "../../utils/rest-api";
import MaterialIcon from "@material/react-material-icon";
// mdc react button
import "@material/react-button/dist/button.css";
import Button from "@material/react-button";


let styles = {
    backgroundColor: "purple",
    color: "white"
};

interface ILandingPageProps extends RouteComponentProps {
    auth: IUpdateAuthState;
    registerLocalLoginSuccess: (userName: string, apiToken: string, avatarUrl: string) => void;
    listApplication: () => void
    listCompany: () => void
}

class LandingPage extends Component<ILandingPageProps> {
    formFactoryProps: any;

    constructor(props: ILandingPageProps) {
        super(props);
    }

    onLoginSuccess = () => {
        // request com & app list (dispatch)
        this.props.listApplication();
        this.props.listCompany();
    }

    render() {
        return (
            <div className="LandingPage" style={styles}>
                {/** redirect logged in user to private routes */
                this.props.auth.isLogin && <Redirect to="/home/" />}
                
                <h1>Appl Tracky</h1>

                <SocialAuthButtonContainer />

                <h2>Or login locally (admin only):</h2>
                <LoginForm 
                    registerLoginSuccess={this.props.registerLocalLoginSuccess}
                    onLoginSuccess={this.onLoginSuccess}
                />

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
            )
    };
};

export const LandingPageContainer = withRouter(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(LandingPage)
);
