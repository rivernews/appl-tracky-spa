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

/** Rest API */
import { CrudType, RequestStatus } from "../../utils/rest-api";

/** Components */
import {
    FormFactory,
    FormActionButtonProps,
    IFormFactoryProps,
    ActionButtonType
} from "../form-factory/form-factory";
import {FormInputFieldMeta } from "../form-factory/form-input-field/form-input-field-meta";
import { InputFieldType, FormBaseFieldMeta } from "../form-factory/form-base-field/form-base-field-meta";
// form fields
import { FormLinkFieldMeta } from "../form-factory/form-link-field/form-link-field-meta";
import { FormApplicationStatusLinkFieldMeta } from "../form-factory/form-application-status-link-field/form-application-status-link-field-meta";
import { ErrorMessage, FormikValues, FormikErrors } from "formik";

interface IApplicationStatusFormComponentProps extends RouteComponentProps {
    applicationStatus?: ApplicationStatus; // for update form
    onSubmitSuccess?: () => void;
    onCancel: () => void;

    /** redux */
    application: Application;
    applicationStatusStore: IObjectStore<ApplicationStatus>
    createApplicationStatus: (
        applicationStatusFormData: ApplicationStatus,
        successCallback?: Function,
        finalCallback?: Function,
    ) => void;
    updateApplicationStatus: (
        applicationStatusFormData: ApplicationStatus,
        successCallback?: Function,
        finalCallback?: Function,
    ) => void;
}

class ApplicationStatusFormComponent extends Component<
    IApplicationStatusFormComponentProps
> {
    formFieldPropsList: Array<FormBaseFieldMeta>;
    actionButtonPropsList: Array<FormActionButtonProps>;

    constructor(props: IApplicationStatusFormComponentProps) {
        super(props);

        this.formFieldPropsList = [
            new FormInputFieldMeta({
                fieldName: "text",
                label: "Status*",
            }),
            new FormInputFieldMeta({
                fieldName: "date",
                label: "Date",
                type: InputFieldType.DATE
            }),
            new FormApplicationStatusLinkFieldMeta({
                fieldName: `applicationstatuslink_set`,
                label: `Status Link`,
                isDynamic: true,
            }),
        ];

        this.actionButtonPropsList = [
            new FormActionButtonProps(
                this.props.applicationStatus ?
                "Save Status":
                "Create Status",
                undefined,
                ActionButtonType.SUBMIT
            ),
            new FormActionButtonProps("Cancel", this.props.onCancel)
        ];
    }

    validate = (values: FormikValues) => {
        let errors: FormikErrors<any> = {};
        // if (!values.application_status__text) {
        //     errors.application_status__text = "Required";
        // }
        // if (!values.application_status__date) {
        //     errors.application_status__date = "Please give a valid date";
        // }
        return errors;
    };

    onSubmit = (
        values: FormikValues,
        { setSubmitting }: { setSubmitting: Function }
    ) => {
        
        console.log("values=", values);

        setSubmitting(false);
        // // prepare relational objects
        // const application__id = this.props.application.uuid;
        // if (!application__id) {
        //     console.error(
        //         "Application object has no uuid so cannot submit form."
        //     );
        //     return;
        // }

        // // create link(s)
        // let links = [];
        // for (let index = 0; index < this.linkFieldsCount; index ++) {
        //     links.push(new Link({
        //         url: values[`application_status__application_status_link__link_${index}__url`],
        //         text: values[`application_status__application_status_link__link_${index}__text`] || `Link of status`,
        //         uuid: (this.props.applicationStatus) ? this.props.applicationStatus.applicationstatuslink_set[index] && this.props.applicationStatus.applicationstatuslink_set[index].link.uuid : "",
        //     }));
        // }
        // // create main object for applicationStatusLink(s)
        // const applicationStatusLinks = links.map((link, index) => {
        //     return new ApplicationStatusLink({
        //         link,
        //         uuid: (this.props.applicationStatus) ? this.props.applicationStatus.applicationstatuslink_set[index] && this.props.applicationStatus.applicationstatuslink_set[index].uuid : "",
        //     });
        // });

        // console.log("App status form: sending app status links=", applicationStatusLinks);

        // // create main object for application status
        // const applicationStatus = new ApplicationStatus({
        //     text: values.application_status__text,
        //     application: application__id,
        //     date: values.application_status__date,
        //     applicationstatuslink_set: applicationStatusLinks,
        // });

        // // dispatch for application status
        // if (!this.props.applicationStatus) {
        //     this.props.createApplicationStatus(applicationStatus, this.props.onSubmitSuccess, () => setSubmitting(false));
        // } else {
        //     applicationStatus.uuid = this.props.applicationStatus.uuid;
        //     this.props.updateApplicationStatus(applicationStatus, this.props.onSubmitSuccess, () => setSubmitting(false));
        // }
        
    }

    render() {
        return (
            <div className="ApplicationStatusFormComponent">
                <FormFactory
                    model={ApplicationStatus}
                    initialInstance={new ApplicationStatus({
                        ...this.props.applicationStatus,
                    })}
                    enforcedInstanceData={{
                        application: this.props.application.uuid
                    }}
        
                    validate={this.validate}
                    
                    formFieldPropsList={this.formFieldPropsList}
                    actionButtonPropsList={this.actionButtonPropsList}
        
                    createInstanceTriggerAction={this.props.createApplicationStatus}
                    updateInstanceTriggerAction={this.props.updateApplicationStatus}

                    onSubmitSuccess={this.props.onSubmitSuccess}
                />
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
            successCallback?: Function,
            failureCallback?: Function,
        ) =>
            dispatch(
                ApplicationStatusActions[CrudType.CREATE][
                    RequestStatus.TRIGGERED
                ].action(applicationStatusFormData, successCallback, undefined, failureCallback)
            )
        ,
        updateApplicationStatus: (
            applicationStatusFormData: ApplicationStatus,
            successCallback?: Function,
            failureCallback?: Function,
        ) =>
            dispatch(
                ApplicationStatusActions[CrudType.UPDATE][
                    RequestStatus.TRIGGERED
                ].action(applicationStatusFormData, successCallback, undefined, failureCallback)
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
