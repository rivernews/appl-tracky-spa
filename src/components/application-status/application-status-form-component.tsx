import React, { Component } from "react";
import { withRouter, RouteComponentProps } from "react-router-dom";

/** Redux */
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { IRootState } from "../../store/types";
// data models
import { ApplicationStatus } from "../../store/data-model/application-status";

/** Components */
import {
    FormFactory,
    FormActionButtonProps,
    IFormFactoryProps
} from "../form-factory/form-factory";
import {
    FormInputFieldFactory,
    FormInputFieldProps
} from "../form-factory/form-field-factory";
import { ErrorMessage, FormikValues, FormikErrors } from "formik";

interface IApplicationStatusFormComponentProps extends RouteComponentProps {
    onCancel: (event: any) => void
}

class ApplicationStatusFormComponent extends Component<
    IApplicationStatusFormComponentProps
> {

    formFactoryProps: IFormFactoryProps<ApplicationStatus>

    constructor(props: IApplicationStatusFormComponentProps) {
        super(props);

        const initialValues = new ApplicationStatus({});
        const formInputFieldProps = new FormInputFieldProps(
            "application_status__text", "Type"
        );
        const formSubmitButtonProps = new FormActionButtonProps(
            "Add", undefined, "submit"
        );
        const formCancelButtonProps = new FormActionButtonProps(
            "Cancel", this.props.onCancel
        );

        this.formFactoryProps = {
            initialValues: initialValues,
            validate: this.validate,
            onSubmit: this.onSubmit,
            formInputFieldPropsList: [
                formInputFieldProps,
            ],
            actionButtonPropsList: [
                formSubmitButtonProps,
                formCancelButtonProps,
            ],
        };
    }

    validate = (values: FormikValues) => {
        let errors: FormikErrors<ApplicationStatus> = {}
        return errors;
    }

    onSubmit = (values: FormikValues, { setSubmitting } : { setSubmitting: Function }) => {
        setSubmitting(false);
        console.log("values=", values)
    }

    render() {
        return (
            <div className="ApplicationStatusFormComponent">
                <FormFactory {...this.formFactoryProps}  />
            </div>
        );
    }
}

const mapStateToProps = (store: IRootState) => ({
    // prop: store.prop
});

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
    // actionName: (newState for that action & its type) => dispatch(ActionCreatorFunction(newState))
    return {
        // listObjectName: (callback?: Function) =>
        // 	dispatch(
        // 		ObjectNameActions[CrudType.LIST][RequestStatus.TRIGGERED].action(
        // 			new ObjectName({}),
        // 			callback
        // 		)
        // 	),
    };
};

export const ApplicationStatusFormComponentContainer = withRouter(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(ApplicationStatusFormComponent)
);
