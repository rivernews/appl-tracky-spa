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
import {
    Company,
    CompanyActions
} from "../../store/data-model/company";
import { Link } from "../../store/data-model/link";
import { Address } from "../../store/data-model/address";

/** Components */
import {
    FormFactory,
    FormActionButtonProps,
    IFormFactoryProps,
    ActionButtonType,
} from "../form-factory/form-factory";
import {
    FormInputFieldFactory,
    FormInputFieldProps,
    InputFieldType
} from "../form-factory/form-field-factory";
import { ErrorMessage, FormikValues, FormikErrors } from "formik";

interface ICompanyFormComponentProps {
    onCancel: (event: any) => void;
    onSubmitSuccess?: (event: any) => void;

    /** redux */
    createCompany: (
        companyFormData: Company,
        callback?: Function
    ) => void;
}

class CompanyFormComponent extends Component<
    ICompanyFormComponentProps
> {
    formFactoryProps: IFormFactoryProps<any>;

    constructor(props: ICompanyFormComponentProps) {
        super(props);

        // prepare for new company form
        const initialValues = {
            company__name: "",
            company__hq_location__full_address: "",
            company__home_page__url: ""
        };

        this.formFactoryProps = {
            initialValues: initialValues,
            validate: this.validateAppForm,
            onSubmit: this.onSubmitAppForm,
            formInputFieldPropsList: [
                new FormInputFieldProps(
                    "company__name",
                    "Company Name*"
                ),
                new FormInputFieldProps(
                    "company__hq_location__full_address",
                    "HQ Address or Location"
                ),
                new FormInputFieldProps(
                    "company__home_page__url",
                    "Company Home Page URL"
                )
            ],
            actionButtonPropsList: [
                new FormActionButtonProps("Create", undefined, ActionButtonType.SUBMIT),
                new FormActionButtonProps("Cancel", this.props.onCancel)
            ]
        };
    }

    validateAppForm = (values: FormikValues) => {
        let errors: FormikErrors<any> = {};
        if (!values.company__name) {
            errors.company__name = "Required";
        }
        if (!/^https*\:\/\/.+$/i.test(values.company__home_page__url)) {
            errors.company__home_page__url =
                "Please start by http:// or https://";
        }
        return errors;
    };

    onSubmitAppForm = (
        values: FormikValues,
        { setSubmitting }: { setSubmitting: Function }
    ) => {
        setSubmitting(false);
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
        this.props.createCompany(company, this.props.onSubmitSuccess);
    };

    render() {
        return (
            <div className="CompanyFormComponent">
                <FormFactory {...this.formFactoryProps} />
            </div>
        );
    }
}

const mapStateToProps = (store: IRootState) => ({
});

const mapDispatchToProps = (dispatch: Dispatch<IObjectAction<Company>>) => {
    return {
        createCompany: (
            companyFormData: Company,
            callback?: Function
        ) =>
            dispatch(
                CompanyActions[CrudType.CREATE][
                    RequestStatus.TRIGGERED
                ].action(companyFormData, callback)
            )
    };
};

export const CompanyFormComponentContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(CompanyFormComponent);
