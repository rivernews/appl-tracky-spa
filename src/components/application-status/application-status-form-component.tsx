import React, { Component } from "react";
import { withRouter, RouteComponentProps } from "react-router-dom";

/** Redux */
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { IRootState } from "../../state-management/types/root-types";
import { IObjectStore, IObjectAction, JsonResponseType } from "../../state-management/types/factory-types";
// data models
import { ApplicationStatus } from "../../data-model/application-status/application-status";
import { ApplicationStatusLink } from "../../data-model/application-status-link";
import { Application } from "../../data-model/application/application";
import { ApplicationStatusActionCreators } from "../../state-management/action-creators/root-actions";

/** Rest API */
import { CrudType, ISingleRestApiResponse, RequestStatus } from "../../utils/rest-api";

/** Components */
import {
    FormFactory,
    FormActionButtonProps,
    ActionButtonType
} from "../form-factory/form-factory";
import {FormInputFieldMeta } from "../form-factory/form-input-field/form-input-field-meta";
import { InputFieldType, FormBaseFieldMeta } from "../form-factory/form-base-field/form-base-field-meta";
// form fields
import { FormApplicationStatusLinkFieldMeta } from "../form-factory/form-application-status-link-field/form-application-status-link-field-meta";


interface IApplicationStatusFormComponentProps extends RouteComponentProps {
    applicationStatus?: ApplicationStatus; // for update form
    onSubmitSuccess?: () => void;
    onCancel: () => void;

    /** redux */
    application: Application;
    applicationStatusStore: IObjectStore<ApplicationStatus>
    createApplicationStatus: (
        applicationStatusFormData: ApplicationStatus,
        successCallback?: (jsonResponse: ISingleRestApiResponse<ApplicationStatus>) => void,
        finalCallback?: Function,
    ) => void;
    updateApplicationStatus: (
        applicationStatusFormData: ApplicationStatus,
        successCallback?: (jsonResponse: ISingleRestApiResponse<ApplicationStatus>) => void,
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
                autoFocus: true
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
            successCallback?: (jsonResponse: ISingleRestApiResponse<ApplicationStatus>) => void,
            finalCallback?: Function
        ) =>
            dispatch(
                ApplicationStatusActionCreators[CrudType.CREATE][
                    RequestStatus.TRIGGERED
                ].action({
                    objectClassInstance: applicationStatusFormData, 
                    successCallback: (successCallback as ( (jsonResponse: JsonResponseType<ApplicationStatus>) => void )) ,
                    finalCallback})
            )
        ,
        updateApplicationStatus: (
            applicationStatusFormData: ApplicationStatus,
            successCallback?: (jsonResponse: ISingleRestApiResponse<ApplicationStatus>) => void,
            finalCallback?: Function
        ) =>
            dispatch(
                ApplicationStatusActionCreators[CrudType.UPDATE][
                    RequestStatus.TRIGGERED
                ].action({
                    objectClassInstance: applicationStatusFormData,
                    successCallback: (successCallback as ( (jsonResponse: JsonResponseType<ApplicationStatus>) => void )),
                    finalCallback
                })
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
