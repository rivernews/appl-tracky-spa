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
import {
    FormInputFieldFactory,
    FormInputFieldProps,
    InputFieldType
} from "../../components/form-factory/form-field-factory";
import { ErrorMessage, FormikValues, FormikErrors } from "formik";
import { AuthenticationService } from "../../utils/auth";
import { RestApiService } from "../../utils/rest-api";


let styles = {
    backgroundColor: "purple",
    color: "white"
};

interface ILandingPageProps extends RouteComponentProps {
    auth: IUpdateAuthState;
    loginSuccess: (userName: string, apiToken: string) => void;
    listApplication: () => void
    listCompany: () => void
}

class LandingPage extends Component<ILandingPageProps> {
    formFactoryProps: any;

    constructor(props: ILandingPageProps) {
        super(props);
        this.prepareLoginForm();
    }

    validateLoginForm = (values: FormikValues) => {
        let errors: FormikErrors<any> = {};
        return errors;
    };

    onSubmitLoginForm = (
        values: FormikValues,
        { setSubmitting }: { setSubmitting: Function }
    ) => {
        setSubmitting(false);
        console.log("values=", values);

        // post to get login token

        fetch(`${RestApiService.state.apiBaseUrl}api-token-auth/`, {
            method: "POST",
            mode: "cors",
            credentials: "omit",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(values)
        })
            .then(res => res.json())
            .then(res => {
                console.log("res=", res);
                // set login token
                AuthenticationService.state.apiLoginToken = res.token;

                // set redux auth store isLogin state --- have to write action and reducer.
                this.props.loginSuccess(values.username, res.token);

                // request com & app list (dispatch)
                this.props.listApplication();
                this.props.listCompany();
            })
            .catch(err => {
                console.error("login error~~", err);
            });
    };

    prepareLoginForm = () => {
        const initialValues = {
            username: "",
            password: ""
        };

        this.formFactoryProps = {
            initialValues: initialValues,
            validate: this.validateLoginForm,
            onSubmit: this.onSubmitLoginForm,
            formInputFieldPropsList: [
                new FormInputFieldProps("username", "Username"),
                new FormInputFieldProps(
                    "password",
                    "Password",
                    InputFieldType.PASSWORD
                )
            ],
            actionButtonPropsList: [
                new FormActionButtonProps("Login", undefined, ActionButtonType.SUBMIT)
            ]
        };
    };

    render() {
        return (
            <div className="LandingPage" style={styles}>
                {/** redirect logged in user to private routes */
                this.props.auth.isLogin && <Redirect to="/home/" />}
                <h1>Appl Tracky</h1>
                <SocialAuthButtonContainer />
                <h2>Or login locally:</h2>
                <FormFactory {...this.formFactoryProps} />
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
        loginSuccess: (userName: string, apiToken: string) =>
            dispatch(SuccessLoginAuth(userName, "", apiToken)),
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
