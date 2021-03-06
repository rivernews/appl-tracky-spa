import React, { Component } from "react";

/** Redux */
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { IRootState } from "../../state-management/types/root-types";
import { CrudType, RequestStatus, ISingleRestApiResponse } from "../../utils/rest-api";
import {
    IObjectAction, JsonResponseType, ObjectRestApiJsonResponse
} from "../../state-management/types/factory-types";
// data models
import { Company, labelTypesMapToCompanyGroupTypes } from "../../data-model/company/company";
import { CompanyActionCreators, GroupedCompanyActionCreators } from "../../state-management/action-creators/root-actions";

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
import { FormRichTextFieldMeta } from "../form-factory/form-rich-text-field/form-rich-text-field-meta";


interface ICompanyFormComponentProps {
    company?: Company;
    onCancel: (event: any) => void;
    onSubmitSuccess?: (jsonResponse: ObjectRestApiJsonResponse<Company>) => void;

    /** redux */
    createCompany: (companyFormData: Company, successCallback?: (jsonResponse: ISingleRestApiResponse<Company>) => void, finalCallback?: Function) => void;
    updateCompany: (companyFormData: Company, successCallback?: (jsonResponse: ISingleRestApiResponse<Company>) => void, finalCallback?: Function, updateFromCompany?: Company) => void;
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
                label: "Process Status",
            }),

            new FormAddressFieldMeta({
                fieldName: "hq_location",
                label: "Headquarter Location"
            }),

            new FormLinkFieldMeta({
                fieldName: "home_page",
                label: "Organization Website"
            }),

            new FormRichTextFieldMeta({
                fieldName: "notes",
                label: "Quick Notes (Company Background, Culture, etc)",
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
                CompanyActionCreators[CrudType.CREATE][RequestStatus.TRIGGERED].action({
                    objectClassInstance: companyFormData,
                    successCallback: (jsonResponse: JsonResponseType<Company>) => {
                        jsonResponse = jsonResponse as ISingleRestApiResponse<Company>;
                        // create ref in grouped redux
                        dispatch(
                            // no api calls, so don't dispatch TRIGGER action, just SUCCESS action
                            GroupedCompanyActionCreators[labelTypesMapToCompanyGroupTypes[Company.getLabel(jsonResponse)]][CrudType.CREATE][RequestStatus.SUCCESS].action({
                                jsonResponse: { uuid: jsonResponse.uuid }
                            })
                        );
                        // Only TRIGGER/SUCCESS has success callback. Since this is CREATE/SUCCESS, we can only call the func here. This is necessary because the form component rely on this callback to carry out order-critical operations, like page transition after create, etc.
                        successCallback && successCallback(jsonResponse);
                    },
                    finalCallback
                })
            )
        ),
        updateCompany: (
            companyFormData: Company,
            successCallback?: (jsonResponse: ISingleRestApiResponse<Company>) => void,
            finalCallback?: Function,
            updateFromCompany?: Company
        ) => dispatch(
            CompanyActionCreators[CrudType.UPDATE][RequestStatus.TRIGGERED].action({
                objectClassInstance: companyFormData,
                successCallback: successCallback as ((jsonResponse: JsonResponseType<Company>) => void),
                finalCallback,
                triggerActionOptions: {
                    updateFromObject: updateFromCompany
                }
            })
        )
    };
};

export const CompanyFormComponentContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(CompanyFormComponent);
