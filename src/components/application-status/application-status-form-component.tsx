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
import {FormInputFieldMeta } from "../form-factory/form-input-field/form-input-field-meta";
import { InputFieldType } from "../form-factory/form-base-field/form-base-field-meta";
import { FormLinkFieldMeta } from "../form-factory/form-link-field/form-link-field-meta";
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
    // formFactoryProps: IFormFactoryProps<any>;
    linkFieldsCount: number;

    state: {
        // linkFieldPropsList: Array<FormLinkFieldProps>,
        formFactoryProps: IFormFactoryProps<any>,
    }

    constructor(props: IApplicationStatusFormComponentProps) {
        super(props);

        const applicationStatus = this.props.applicationStatus;
        
        // setup dynamic link fields for initialValues
        // let linkFieldInitialValues: { [key: string]: string } = {}
        this.linkFieldsCount = 0;
        if (applicationStatus) {
            // is update form
            this.linkFieldsCount = applicationStatus.applicationstatuslink_set.length;
        }
        else {
            // is create form
            this.linkFieldsCount = 1; // temp value; provide 2 link fields for create form; TODO: make this dynamic
        }
        // setup initialValue, which should be flatten
        // for (let index = 0; index < this.linkFieldsCount; index++) {
        //     linkFieldInitialValues[`application_status__application_status_link__link_${index}__url`] = applicationStatus ? applicationStatus.applicationstatuslink_set[index].link.url : "";
        //     linkFieldInitialValues[`application_status__application_status_link__link_${index}__text`] = applicationStatus ? applicationStatus.applicationstatuslink_set[index].link.text : "";
        // }

        const initialValues = {
            application_status__text: applicationStatus ? applicationStatus.text : "",
            application_status__date: applicationStatus ? applicationStatus.date : "",
            // ...linkFieldInitialValues,
            application_status: {
                application_status_link: {
                    link: []
                }
            }

        }

        // let linkFieldPropsList: Array<FormLinkFieldProps> = []
        // for (let index = 0; index < this.linkFieldsCount; index++) {
        //     linkFieldPropsList.push(
        //         new FormLinkFieldProps({
        //             fieldName: `application_status__application_status_link__link_${index}`,
        //             label: `Link ${index}`,
        //         })
        //     )
        // }
        const formFactoryProps = {
            initialValues: initialValues,
            validate: this.validate,
            onSubmit: this.onSubmit,
            formInputFieldPropsList: [
                new FormInputFieldMeta({
                    fieldName: "application_status__text",
                    label: "Status*",
                }),
                new FormInputFieldMeta({
                    fieldName: "application_status__date",
                    label: "Date",
                    type: InputFieldType.DATE
                }),
                // ...linkFieldPropsList,
                new FormLinkFieldMeta({
                    fieldName: `application_status.application_status_link.link`,
                    label: `Link`,
                    isDyanmic: true,
                })
            ],
            actionButtonPropsList: [
                // new FormActionButtonProps(
                //     "Add link",
                //     () => this.addLinkField(),
                // ) ,
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

        this.state = {
            // linkFieldPropsList,
            formFactoryProps
        }
    }

    addLinkField() {
        this.setState({
            formFactoryProps: {
                ...this.state.formFactoryProps,
                formInputFieldPropsList: [
                    ...this.state.formFactoryProps.formInputFieldPropsList,
                    new FormLinkFieldMeta({
                        fieldName: `application_status__application_status_link__link_${this.linkFieldsCount}`,
                        label: `Link ${this.linkFieldsCount}`,
                        isDyanmic: true
                    })
                ]
            }
        }, () => {
            this.linkFieldsCount++;
        })
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
                <FormFactory {...this.state.formFactoryProps} />
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
