import React, { Component } from "react";
import { withRouter, RouteComponentProps } from "react-router-dom";

/** Redux */
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { IRootState } from "../../store/types";
import { IObjectStore, IObjectAction } from "../../store/rest-api-redux-factory";
// data models
import {
    ApplicationStatus,
    ApplicationStatusActions
} from "../../store/data-model/application-status";
import {
    ApplicationStatusLink,
} from "../../store/data-model/application-status-link";
import { Application } from "../../store/data-model/application";
import { Link } from "../../store/data-model/link";

/** Rest API */
import { CrudType, RequestStatus } from "../../utils/rest-api";

/** Components */
import {
    FormFactory,
    FormActionButtonProps,
    IFormFactoryProps,
    ActionButtonType
} from "../form-factory/form-factory";
import {
    FormInputFieldFactory,
    FormInputFieldProps,
    InputFieldType
} from "../form-factory/form-field-factory";
import { ErrorMessage, FormikValues, FormikErrors } from "formik";

interface IApplicationStatusFormComponentProps extends RouteComponentProps {
    applicationStatus?: ApplicationStatus; // for update form
    onCancel: (event: any) => void;
    onSubmitSuccess?: () => void;

    /** redux */
    application: Application;
    applicationStatusStore: IObjectStore<ApplicationStatus>
    createApplicationStatus: (
        applicationStatusFormData: ApplicationStatus,
        callback?: Function
    ) => void;
    updateApplicationStatus: (
        applicationStatusFormData: ApplicationStatus,
        callback?: Function
    ) => void;
}

class ApplicationStatusFormComponent extends Component<
    IApplicationStatusFormComponentProps
> {
    formFactoryProps: IFormFactoryProps<any>;

    constructor(props: IApplicationStatusFormComponentProps) {
        super(props);

        const applicationStatus = this.props.applicationStatus;
        const initialValues = {
            application_status__text: applicationStatus ? applicationStatus.text : "",
            application_status__date: applicationStatus ? applicationStatus.date : "",
            application_status__link0__url: applicationStatus ? applicationStatus.applicationstatuslink_set[0].link.url : "",
            application_status__link0__text: applicationStatus ? applicationStatus.applicationstatuslink_set[0].link.text : "",
            application_status__link1__url: applicationStatus ? applicationStatus.applicationstatuslink_set[1].link.url : "",
            application_status__link1__text: applicationStatus ? applicationStatus.applicationstatuslink_set[1].link.text : "",
        }

        this.formFactoryProps = {
            initialValues: initialValues,
            validate: this.validate,
            onSubmit: this.onSubmit,
            formInputFieldPropsList: [
                new FormInputFieldProps("application_status__text", "Status*"),
                new FormInputFieldProps(
                    "application_status__date",
                    "Date",
                    InputFieldType.DATE
                ),
                new FormInputFieldProps("application_status__link0__url", "Link 0 URL"),
                new FormInputFieldProps("application_status__link0__text", "Link 0 Text"),
                new FormInputFieldProps("application_status__link1__url", "Link 1 URL"),
                new FormInputFieldProps("application_status__link1__text", "Link 1 Text"),
            ],
            actionButtonPropsList: [
                new FormActionButtonProps(
                    applicationStatus ?
                    "Update Status":
                    "Add Status",
                    undefined,
                    ActionButtonType.SUBMIT
                ),
                new FormActionButtonProps("Cancel", this.props.onCancel)
            ]
        };
    }

    validate = (values: FormikValues) => {
        let errors: FormikErrors<any> = {};
        if (!values.application_status__text) {
            errors.application_status__text = "Required";
        }
        if (!values.application_status__date) {
            errors.application_status__date = "Please give a valid date";
        }
        return errors;
    };

    onSubmit = (
        values: FormikValues,
        { setSubmitting }: { setSubmitting: Function }
    ) => {
        setSubmitting(false);
        console.log("values=", values);

        // prepare relational objects
        const application__id = this.props.application.uuid;
        if (!application__id) {
            console.error(
                "Application object has no uuid so cannot submit form."
            );
            return;
        }

        // create link(s)
        let links = [];
        const indexes = [0, 1];
        for (let index of indexes) {
            links.push(new Link({
                url: values[`application_status__link${index}__url`],
                text: values[`application_status__link${index}__text`] || `Link of status`,
                uuid: (this.props.applicationStatus) ? this.props.applicationStatus.applicationstatuslink_set[index].link.uuid : "",
            }))
        }
        // create main object for applicationStatusLink(s)
        const applicationStatusLinks = links.map((link, index) => {
            return new ApplicationStatusLink({
                link,
                uuid: (this.props.applicationStatus) ? this.props.applicationStatus.applicationstatuslink_set[index].uuid : "",
            });
        });

        console.log("App status form: sending app status links=", applicationStatusLinks);

        // create main object for application status
        const applicationStatus = new ApplicationStatus({
            text: values.application_status__text,
            application: application__id,
            date: values.application_status__date,
            applicationstatuslink_set: applicationStatusLinks,
        });

        // dispatch for application status
        if (!this.props.applicationStatus) {
            this.props.createApplicationStatus(applicationStatus, this.props.onSubmitSuccess);
        } else {
            applicationStatus.uuid = this.props.applicationStatus.uuid;
            this.props.updateApplicationStatus(applicationStatus, this.props.onSubmitSuccess);
        }
        
    };

    render() {
        return (
            <div className="ApplicationStatusFormComponent">
                <FormFactory {...this.formFactoryProps} />
            </div>
        );
    }
}

const mapStateToProps = (store: IRootState) => ({
    // prop: store.prop
    applicationStatusStore: store.applicationStatus
});

const mapDispatchToProps = (dispatch: Dispatch<IObjectAction<ApplicationStatus> | IObjectAction<ApplicationStatusLink>>) => {
    // actionName: (newState for that action & its type) => dispatch(ActionCreatorFunction(newState))
    return {
        createApplicationStatus: (
            applicationStatusFormData: ApplicationStatus,
            callback?: Function
        ) =>
            dispatch(
                ApplicationStatusActions[CrudType.CREATE][
                    RequestStatus.TRIGGERED
                ].action(applicationStatusFormData, callback)
            )
        ,
        updateApplicationStatus: (
            applicationStatusFormData: ApplicationStatus,
            callback?: Function
        ) =>
            dispatch(
                ApplicationStatusActions[CrudType.UPDATE][
                    RequestStatus.TRIGGERED
                ].action(applicationStatusFormData, callback)
            )
        ,
    };
};

export const ApplicationStatusFormComponentContainer = withRouter(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(ApplicationStatusFormComponent)
);
