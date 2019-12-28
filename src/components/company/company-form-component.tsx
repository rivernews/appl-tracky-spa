import React, { Component } from "react";

/** Redux */
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { IRootState } from "../../store/types";
import { CrudType, RequestStatus, ISingleRestApiResponse } from "../../utils/rest-api";
import {
    IObjectAction, ObjectRestApiJsonResponse
} from "../../store/rest-api-redux-factory";
// data models
import { Company, CompanyActions, GroupedCompanyRestApiRedux, labelTypesMapToCompanyGroupTypes } from "../../store/data-model/company";

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
import { FormLabelFieldMeta } from "../form-factory/form-label-field/form-label-field-meta";


interface ICompanyFormComponentProps {
    company?: Company;
    onCancel: (event: any) => void;
    onSubmitSuccess?: (jsonResponse: ObjectRestApiJsonResponse<Company>) => void;

    /** redux */
    createCompany: (companyFormData: Company, successCallback?: (jsonResponse: ISingleRestApiResponse<Company>) => void, finalCallback?: Function) => void;
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

            new FormLabelFieldMeta({
                fieldName: "labels",
                label: "Label",
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
        createCompany: (companyFormData: Company, successCallback?: (jsonResponse: ISingleRestApiResponse<Company>) => void, finalCallback?: Function) => (
            // create company object in pool redux
            dispatch(
                CompanyActions[CrudType.CREATE][RequestStatus.TRIGGERED].action(
                    companyFormData,
                    (jsonResponse: ISingleRestApiResponse<Company>) => {
                        // create ref in grouped redux
                        dispatch(
                            // no api calls, so don't dispatch TRIGGER action, just SUCCESS action
                            GroupedCompanyRestApiRedux[labelTypesMapToCompanyGroupTypes[Company.getLabel(jsonResponse)]].actions[CrudType.CREATE][RequestStatus.SUCCESS].action({ uuid: jsonResponse.uuid })
                        );
                        // Only TRIGGER/SUCCESS has success callback. Since this is CREATE/SUCCESS, we can only call the func here. This is necessary because the form component rely on this callback to carry out order-critical operations, like page transition after create, etc.
                        successCallback && successCallback(jsonResponse);
                    },
                    undefined,
                    finalCallback
                )
            )
        ),
        updateCompany: (companyFormData: Company, successCallback?: Function, finalCallback?: Function, updateFromCompany?: Company) => dispatch(
            CompanyActions[CrudType.UPDATE][RequestStatus.TRIGGERED].action(
                companyFormData,
                successCallback,
                undefined,
                finalCallback,
                undefined,
                {
                    updateFromObject: updateFromCompany
                }
            )
        )
    };
};

export const CompanyFormComponentContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(CompanyFormComponent);
