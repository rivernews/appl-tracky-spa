import React, { Component } from "react";

/** Redux */
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { IRootState } from "../../state-management/types/root-types";
import { CrudType, ISingleRestApiResponse, RequestStatus } from "../../utils/rest-api";
import {
    IObjectStore,
    IObjectAction,
    JsonResponseType
} from "../../state-management/types/factory-types";
import { ApplicationActionCreators } from "../../state-management/action-creators/root-actions";

// data models
import { Company } from "../../data-model/company/company";
import { Application } from "../../data-model/application/application";

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
import { FormRichTextFieldMeta } from "../form-factory/form-rich-text-field/form-rich-text-field-meta";


interface IApplicationFormComponentProps {
    application?: Application;
    onCancel: (event: any) => void;
    onSubmitSuccess?: () => void;

    company: Company;
    /** redux */
    applicationStore: IObjectStore<Application>;
    createApplication: (
        applicationFormData: Application,
        successCallback?: (jsonResponse: ISingleRestApiResponse<Application>) => void,
        finalCallback?: Function,
    ) => void;
    updateApplication: (
        applicationFormData: Application,
        successCallback?: (jsonResponse: ISingleRestApiResponse<Application>) => void,
        finalCallback?: Function,
    ) => void;
}

class ApplicationFormComponent extends Component<
    IApplicationFormComponentProps
> {

    formFieldPropsList: Array<FormBaseFieldMeta>;
    actionButtonPropsList: Array<FormActionButtonProps>;

    constructor(props: IApplicationFormComponentProps) {
        super(props);

        this.formFieldPropsList = [
            new FormInputFieldMeta({
                fieldName: "position_title",
                label: "Position Title*",
                autoFocus: true
            }),
            new FormLinkFieldMeta({
                fieldName: "job_description_page",
                label: "Job Description Link",
            }),
            new FormLinkFieldMeta({
                fieldName: "job_source",
                label: "Job Source Link",
            }),
            new FormRichTextFieldMeta({
                fieldName: "notes",
                label: "Quick Notes",
            }),
            new FormRichTextFieldMeta({
                fieldName: "job_description_notes",
                label: "Job Description Notes",
            }),
        ];
        this.actionButtonPropsList = [
            new FormActionButtonProps(
                this.props.company ? "Save Application" : "Create Application",
                undefined,
                ActionButtonType.SUBMIT
            ),
            new FormActionButtonProps("Cancel", this.props.onCancel)
        ]
    }

    render() {
        return (
            <div className="ApplicationFormComponent">
                {/* <FormFactory {...this.formFactoryProps} /> */}
                <FormFactory
                    model={Application}
                    initialInstance={new Application({
                        ...this.props.application,
                    })}
                    enforcedInstanceData={{
                        user_company: this.props.company.uuid
                    }}
        
                    formFieldPropsList={this.formFieldPropsList}
                    actionButtonPropsList={this.actionButtonPropsList}
        
                    createInstanceTriggerAction={this.props.createApplication}
                    updateInstanceTriggerAction={this.props.updateApplication}

                    onSubmitSuccess={this.props.onSubmitSuccess}
                />
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
            successCallback?: (jsonResponse: ISingleRestApiResponse<Application>) => void,
            finalCallback?: Function,
        ) =>
            dispatch(
                ApplicationActionCreators[CrudType.CREATE][
                    RequestStatus.TRIGGERED
                ].action({
                    objectClassInstance: applicationFormData, 
                    successCallback: successCallback as ( (jsonResponse: JsonResponseType<Application>) => void ), 
                    finalCallback
                })
            )
        ,
        updateApplication: (
            applicationFormData: Application,
            successCallback?: (jsonResponse: ISingleRestApiResponse<Application>) => void,
            finalCallback?: Function,
        ) =>
            dispatch(
                ApplicationActionCreators[CrudType.UPDATE][
                    RequestStatus.TRIGGERED
                ].action({
                    objectClassInstance: applicationFormData,
                    successCallback: successCallback as ( (jsonResponse: JsonResponseType<Application>) => void ), 
                    finalCallback
                })
            )
        ,
    };
};

export const ApplicationFormComponentContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(ApplicationFormComponent);
