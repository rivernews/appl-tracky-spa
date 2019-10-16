import React, { Component } from "react";

/** Redux */
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { IRootState } from "../../store/types";
import { CrudType, RequestStatus } from "../../utils/rest-api";
import {
    IObjectAction
} from "../../store/rest-api-redux-factory";
// data models
import { Company, CompanyActions } from "../../store/data-model/company";

/** Components */
import {
    FormFactory,
    FormActionButtonProps,
    ActionButtonType
} from "../form-factory/form-factory";
// form field
import { FormBaseFieldMeta } from "../form-factory/form-base-field/form-base-field-meta";
import { FormInputFieldMeta } from "../form-factory/form-input-field/form-input-field-meta";
import { FormLinkFieldMeta } from "../form-factory/form-link-field/form-link-field-meta";
import { FormAddressFieldMeta } from "../form-factory/form-address-field/form-address-field-meta";

interface ICompanyFormComponentProps {
    company?: Company;
    onCancel: (event: any) => void;
    onSubmitSuccess?: () => void;

    /** redux */
    createCompany: (companyFormData: Company, successCallback?: Function, finalCallback?: Function) => void;
    updateCompany: (companyFormData: Company, successCallback?: Function, finalCallback?: Function) => void;
}

class CompanyFormComponent extends Component<ICompanyFormComponentProps> {

    formFieldPropsList: Array<FormBaseFieldMeta>;
    actionButtonPropsList: Array<FormActionButtonProps>;

    constructor(props: ICompanyFormComponentProps) {
        super(props);

        this.formFieldPropsList = [
            new FormInputFieldMeta({
                fieldName: "name",
                label: "Organization Name*",
                autoFocus: true
            }),

            new FormAddressFieldMeta({
                fieldName: "hq_location",
                label: "Headquarter Location"
            }),

            new FormLinkFieldMeta({
                fieldName: "home_page",
                label: "Organization Website"
            }),
        ];

        this.actionButtonPropsList = [
            new FormActionButtonProps(
                !this.props.company ? "Create Company" : "Save Company",
                undefined,
                ActionButtonType.SUBMIT
            ),
            new FormActionButtonProps("Cancel", this.props.onCancel)
        ]

    }

    render() {
        return (
            <div className="CompanyFormComponent">
                <FormFactory
                    model={Company}
                    initialInstance={this.props.company}
        
                    formFieldPropsList={this.formFieldPropsList}
                    actionButtonPropsList={this.actionButtonPropsList}
        
                    createInstanceTriggerAction={this.props.createCompany}
                    updateInstanceTriggerAction={this.props.updateCompany}

                    onSubmitSuccess={this.props.onSubmitSuccess}
                />
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
