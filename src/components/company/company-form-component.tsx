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
import { Company, CompanyActions } from "../../store/data-model/company";
import { Link } from "../../store/data-model/link";
import { Address } from "../../store/data-model/address";

/** Components */
import {
    FormFactory,
    FormActionButtonProps,
    IFormFactoryProps,
    ActionButtonType
} from "../form-factory/form-factory";
import { FormInputFieldMeta } from "../form-factory/form-input-field/form-input-field-meta";
import { ErrorMessage, FormikValues, FormikErrors } from "formik";

interface ICompanyFormComponentProps {
    company?: Company;
    onCancel: (event: any) => void;
    onSubmitSuccess?: () => void;

    /** redux */
    createCompany: (companyFormData: Company, successCallback?: Function, finalCallback?: Function) => void;
    updateCompany: (companyFormData: Company, successCallback?: Function, finalCallback?: Function) => void;
}

class CompanyFormComponent extends Component<ICompanyFormComponentProps> {
    formFactoryProps: IFormFactoryProps<any>;

    constructor(props: ICompanyFormComponentProps) {
        super(props);

        // prepare for new company form
        const initialValues = {
            company__name: this.props.company && this.props.company.name ||  "",
            company__hq_location__full_address: this.props.company && this.props.company.hq_location.full_address ||  "",
            company__home_page__url: this.props.company && this.props.company.home_page.url || "",
        };

        this.formFactoryProps = {
            initialValues: initialValues,
            validate: this.validateAppForm,
            onSubmit: this.onSubmitAppForm,
            formInputFieldPropsList: [
                new FormInputFieldMeta({
                    fieldName: "company__name",
                    label: "Company Name*"
                }),

                new FormInputFieldMeta({
                    fieldName: "company__hq_location__full_address",
                    label: "HQ Address or Location"
                }),

                new FormInputFieldMeta({
                    fieldName: "company__home_page__url",
                    label: "Company Home Page URL"
                }),
            ],
            actionButtonPropsList: [
                new FormActionButtonProps(
                    !this.props.company ? "Create" : "Update",
                    undefined,
                    ActionButtonType.SUBMIT
                ),
                new FormActionButtonProps("Cancel", this.props.onCancel)
            ]
        };
    }

    validateAppForm = (values: FormikValues) => {
        let errors: FormikErrors<any> = {};
        if (!values.company__name) {
            errors.company__name = "Required";
        }
        // if (!/^https*\:\/\/.+$/i.test(values.company__home_page__url)) {
        //     errors.company__home_page__url =
        //         "Please start by http:// or https://";
        // }
        return errors;
    };

    onSubmitAppForm = (
        values: FormikValues,
        { setSubmitting }: { setSubmitting: Function }
    ) => {
        setSubmitting(true);
        console.log("values=", values);

        // prep relationship object by data model
        const hq_location = new Address({
            full_address: values.company__hq_location__full_address,
            place_name: `HQ of ${values.company__name}`
        });
        const home_page = new Link({
            url: values.company__home_page__url,
            text: `Home page of ${values.company__name}`
        });
        // create main object
        const company = new Company({
            name: values.company__name,
            hq_location,
            home_page
        });

        // dispatch
        if (!this.props.company) {
            console.log("company form: dispatching createCompany action");
            this.props.createCompany(company, this.props.onSubmitSuccess, () => setSubmitting(false));
        }
        else  {
            console.log("company form: dispatching updateCompany action");
            company.uuid = this.props.company.uuid;
            this.props.updateCompany(company, this.props.onSubmitSuccess, () => setSubmitting(false));
        }
    };

    render() {
        return (
            <div className="CompanyFormComponent">
                <FormFactory {...this.formFactoryProps} />
            </div>
        );
    }
}

const mapStateToProps = (store: IRootState) => ({});

const mapDispatchToProps = (dispatch: Dispatch<IObjectAction<Company>>) => {
    return {
        createCompany: (companyFormData: Company, successCallback?: Function, finalCallback?: Function) =>
            dispatch(
                CompanyActions[CrudType.CREATE][RequestStatus.TRIGGERED].action(
                    companyFormData,
                    successCallback,
                    undefined,
                    finalCallback,
                )
            ),
        updateCompany: (companyFormData: Company, successCallback?: Function, finalCallback?: Function) =>
            dispatch(
                CompanyActions[CrudType.UPDATE][RequestStatus.TRIGGERED].action(
                    companyFormData,
                    successCallback,
                    undefined,
                    finalCallback,
                )
            )
    };
};

export const CompanyFormComponentContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(CompanyFormComponent);
