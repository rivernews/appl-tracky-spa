import React, { Component } from "react";

/** Redux */
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { IRootState } from "../../store/types";
import { CrudType, RequestStatus } from "../../utils/rest-api";
import {
    IObjectStore,
    IObjectAction
} from "../../store/rest-api-redux-factory";
// data models
import { Company } from "../../store/data-model/company";
import {
    Application,
    ApplicationActions
} from "../../store/data-model/application";
import { Link } from "../../store/data-model/link";

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

interface IApplicationFormComponentProps {
    application?: Application;
    onCancel: (event: any) => void;
    onSubmitSuccess?: () => void;

    company: Company;
    /** redux */
    applicationStore: IObjectStore<Application>;
    createApplication: (
        applicationFormData: Application,
        callback?: Function
    ) => void;
    updateApplication: (
        applicationFormData: Application,
        callback?: Function
    ) => void;
}

class ApplicationFormComponent extends Component<
    IApplicationFormComponentProps
> {
    formFactoryProps: IFormFactoryProps<any>;

    constructor(props: IApplicationFormComponentProps) {
        super(props);

        // prepare for new application form
        const application = this.props.application;
        const initialValues = {
            application__position_title: application
                ? application.position_title
                : "",
            application__job_description_page__url: application
                ? application.job_description_page.url
                : "",
            application__job_source__url: application
                ? application.job_source.url
                : ""
        };

        this.formFactoryProps = {
            initialValues: initialValues,
            validate: this.validateAppForm,
            onSubmit: this.onSubmitAppForm,
            formInputFieldPropsList: [
                new FormInputFieldProps(
                    "application__position_title",
                    "Position Title*"
                ),
                new FormInputFieldProps(
                    "application__job_description_page__url",
                    "Job Description URL"
                ),
                new FormInputFieldProps(
                    "application__job_source__url",
                    "Job Source URL"
                )
            ],
            actionButtonPropsList: [
                new FormActionButtonProps(
                    application ? "Update" : "Create",
                    undefined,
                    ActionButtonType.SUBMIT
                ),
                new FormActionButtonProps("Cancel", this.props.onCancel)
            ]
        };
    }

    validateAppForm = (values: FormikValues) => {
        let errors: FormikErrors<any> = {};
        if (!values.application__position_title) {
            errors.application__position_title = "Required";
        }
        if (
            !/^https*\:\/\/.+$/i.test(
                values.application__job_description_page__url
            )
        ) {
            errors.application__job_description_page__url =
                "Please start by http:// or https://";
        }
        if (!/^https*\:\/\/.+$/i.test(values.application__job_source__url)) {
            errors.application__job_source__url =
                "Please start by http:// or https://";
        }
        return errors;
    };

    onSubmitAppForm = (
        values: FormikValues,
        { setSubmitting }: { setSubmitting: Function }
    ) => {
        setSubmitting(false);

        // prep relationship object by data model
        const job_description_page = new Link({
            url: values.application__job_description_page__url,
            text: `Job description URL for application ${
                values.application__position_title
            } at company ${this.props.company.name}`
        });
        const job_source = new Link({
            url: values.application__job_source__url,
            text: `Job source URL for application ${
                values.application__position_title
            } at company ${this.props.company.name}`
        });
        const application__user_company__id = this.props.company.uuid;

        // create main object
        const application = new Application({
            position_title: values.application__position_title,
            job_description_page,
            job_source,
            user_company: application__user_company__id
        });

        // dispatch
        if (!this.props.application) {
            this.props.createApplication(application, () => {
                // log print newly created application
                if (this.props.applicationStore.lastChangedObjectID) {
                    const newApplication = this.props.applicationStore
                        .collection[
                        this.props.applicationStore.lastChangedObjectID
                    ];
                    console.log("new application:", newApplication);
                    this.props.onSubmitSuccess && this.props.onSubmitSuccess();
                } else {
                    console.error(
                        "application store has no lastChangedObjectID"
                    );
                }
            });
        } else {
            this.props.updateApplication(application, this.props.onSubmitSuccess);
        }
    };

    render() {
        return (
            <div className="ApplicationFormComponent">
                <FormFactory {...this.formFactoryProps} />
            </div>
        );
    }
}

const mapStateToProps = (store: IRootState) => ({
    applicationStore: store.application
});

const mapDispatchToProps = (dispatch: Dispatch<IObjectAction<Application>>) => {
    return {
        createApplication: (
            applicationFormData: Application,
            callback?: Function
        ) =>
            dispatch(
                ApplicationActions[CrudType.CREATE][
                    RequestStatus.TRIGGERED
                ].action(applicationFormData, callback)
            )
        ,
        updateApplication: (
            applicationFormData: Application,
            callback?: Function
        ) =>
            dispatch(
                ApplicationActions[CrudType.UPDATE][
                    RequestStatus.TRIGGERED
                ].action(applicationFormData, callback)
            )
        ,
    };
};

export const ApplicationFormComponentContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(ApplicationFormComponent);
