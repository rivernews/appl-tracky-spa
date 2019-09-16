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
        successCallback?: Function,
        finalCallback?: Function,
    ) => void;
    updateApplication: (
        applicationFormData: Application,
        successCallback?: Function,
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
                label: "Position Title*"
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
                label: "Notes",
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
            successCallback?: Function,
            finalCallback?: Function,
        ) =>
            dispatch(
                ApplicationActions[CrudType.CREATE][
                    RequestStatus.TRIGGERED
                ].action(applicationFormData, successCallback, undefined, finalCallback)
            )
        ,
        updateApplication: (
            applicationFormData: Application,
            successCallback?: Function,
            finalCallback?: Function,
        ) =>
            dispatch(
                ApplicationActions[CrudType.UPDATE][
                    RequestStatus.TRIGGERED
                ].action(applicationFormData, successCallback, undefined, finalCallback)
            )
        ,
    };
};

export const ApplicationFormComponentContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(ApplicationFormComponent);
