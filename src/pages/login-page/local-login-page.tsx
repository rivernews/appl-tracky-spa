import React, { Component } from "react";
import { withRouter, RouteComponentProps, Redirect } from "react-router-dom";

/** Redux */
import { connect } from "react-redux";
import { Dispatch, AnyAction } from "redux";
import { IRootState } from "../../state-management/types/root-types";
import { IUpdateAuthState, RequestedLoginMode } from "../../state-management/types/auth-types";
import { RequestedLoginAuth } from "../../state-management/action-creators/auth-actions";
import { FormikValues } from "formik";

/** Components */
import { LoginForm } from "../../components/login/local-login-form";
// mdc react button
import "@material/react-button/dist/button.css";


interface ILocalLoginPageProps extends RouteComponentProps {
    /** redux state */
    auth: IUpdateAuthState;

    /** dispatch action */
    requestedLoginAuth: (username: string, password: string, onCompleteCallback: () => void) => void;
}

class LocalLoginPage extends Component<ILocalLoginPageProps> {
    onLoginFormCancel = () => {
        this.props.history.goBack();
    }

    onLoginFormSubmit = (values: FormikValues, setSubmitting: Function) => {
        this.props.requestedLoginAuth(values.username, values.password, () => {
            setSubmitting(false);
        });
    }

    render() {
        return (
            <div className="LocalLoginPage">
                <h1>Login Portal for local sign in</h1>
                <div>
                    If you just want to try it out, you can use guest account:
                    <div>
                        username: guest
                    </div>
                    <div>
                        password: appltracky
                    </div>
                </div>

                <LoginForm
                    onSubmit={this.onLoginFormSubmit}
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
        requestedLoginAuth: (username: string, password: string, onCompleteCallback: () => void) => {
            dispatch(
                RequestedLoginAuth(RequestedLoginMode.LOCAL, {
                    username, password
                }, onCompleteCallback)
            );
        },
    }
};

export const LocalLoginPageContainer = withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(LocalLoginPage));
