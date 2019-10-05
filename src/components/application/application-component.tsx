import React, { Component } from "react";

/** Redux */
import { connect } from "react-redux";
import {
    Application,
    ApplicationActions
} from "../../store/data-model/application";
import { IRootState } from "../../store/types";
import { IObjectAction } from "../../store/rest-api-redux-factory";
import { Dispatch } from "redux";

/** data model */
import { ApplicationStatus } from "../../store/data-model/application-status";
import { Company } from "../../store/data-model/company";

/** rest api */
import { CrudType, RequestStatus } from "../../utils/rest-api";

/** Components */
// mdc react icon
import MaterialIcon from "@material/react-material-icon";
// mdc react button
import "@material/react-button/dist/button.css";
import Button from "@material/react-button";
import IconButton from "@material/react-icon-button";
import { ApplicationStatusComponentContainer } from "../application-status/application-status-component";
import { ApplicationFormComponentContainer } from "./application-form-component";
/** CKeditor */
import CKEditor from '@ckeditor/ckeditor5-react';
import BalloonEditor from '@ckeditor/ckeditor5-build-balloon';
// import BalloonEditor from '@shaungc/ckeditor5-custom-balloon';

/** Types */
interface IApplicationComponentProps {
    application?: Application;

    /** application form */
    company?: Company;

    isOnlyForm?: boolean;

    applicationStatusList?: Array<ApplicationStatus>;
    isShowApplicationStatuses?: boolean;

    /** redux */
    deleteApplication: (
        applicationToDelete: Application,
        callback?: Function
    ) => void;
}

interface IApplicationComponentState {
    isFormOpened: boolean;
}

/** Main Class */
export class ApplicationComponent extends Component<
    IApplicationComponentProps,
    IApplicationComponentState
> {
    state = {
        isFormOpened: false
    };

    render() {
        return (
            <div className="application-component">
                {this.state.isFormOpened || this.props.isOnlyForm
                    ? this.renderApplicationFormController()
                    : this.props.application &&
                      Array.isArray(this.props.applicationStatusList) &&
                      this.renderApplicationDisplay(
                          this.props.application,
                          this.props.applicationStatusList
                      )}
            </div>
        );
    }

    renderApplicationFormController = () => {
        return (
            this.props.company && ( // application create or udpate must have company associate with it.
                <div className="application-form-controller">
                    {!this.state.isFormOpened ? (
                        <Button
                            onClick={clickEvent => {
                                this.setState({
                                    isFormOpened: true
                                });
                            }}
                            unelevated
                            icon={<MaterialIcon hasRipple icon="add" />}
                        >
                            Add Application
                        </Button>
                    ) : (
                        <ApplicationFormComponentContainer
                            onCancel={event => {
                                process.env.NODE_ENV === 'development' && console.log("onCancel clicked");
                                this.setState({
                                    isFormOpened: false
                                });
                            }}
                            onSubmitSuccess={() =>
                                this.setState({
                                    isFormOpened: false
                                })
                            }
                            company={this.props.company}
                            application={this.props.application}
                        />
                    )}
                </div>
            )
        );
    };

    renderApplicationDisplay = (
        application: Application,
        applicationStatusList: Array<ApplicationStatus>
    ) => {
        return (
            <div className="application-component-display">
                {/* application display view */}
                <h3>Application</h3>
                <p>
                    <span>
                        <strong>Position:</strong> {application.position_title}
                    </span>

                    <IconButton
                        onClick={() => {
                            this.setState({
                                isFormOpened: true // open form and close display
                            });
                        }}
                    >
                        <MaterialIcon hasRipple icon="edit" />
                    </IconButton>
                    <IconButton
                        onClick={() =>
                            this.props.deleteApplication(application)
                        }
                    >
                        <MaterialIcon hasRipple icon="delete" />
                    </IconButton>
                    <br />
                    <span>Application UUID: {application.uuid}</span>
                    <br />
                    {application.job_description_page.url && (
                        <span>
                            <strong>JD Page: </strong>
                            <a
                                target="_blank"
                                href={
                                    application.job_description_page.url && application.job_description_page.url.includes("//") ?
                                    application.job_description_page.url :
                                    `//${application.job_description_page.url}`
                                }
                            >
                                {application.job_description_page.text || "Link"}
                            </a>
                        </span> 
                    )}

                    <br />
                    {application.job_source.url && (
                        <span>
                            <strong>Job Source: </strong>
                            <a target="_blank" href={
                                (application.job_source.url && application.job_source.url.includes("//")) ?
                                application.job_source.url :
                                `//${application.job_source.url}`
                            }>
                                {application.job_source.text || "Link"}
                            </a>
                        </span>
                    )}
                </p>

                <div>
                    <div><strong>Notes</strong></div>
                    {application.notes ? (
                        <CKEditor 
                            editor={BalloonEditor}
                            disabled={true}
                            data={application.notes}
                        />
                        
                    ) : (
                        <p>
                            No notes yet.
                        </p>
                    )}
                </div>

                {/* application statuses list */}
                {this.props.isShowApplicationStatuses &&
                    applicationStatusList.map(status => {
                        return (
                            <ApplicationStatusComponentContainer
                                key={status.uuid}
                                applicationStatus={status}
                                application={application}
                            />
                        );
                    })}

                {/* application status form controller */}
                {this.props.isShowApplicationStatuses && (
                    <ApplicationStatusComponentContainer
                        application={application}
                        isOnlyForm
                    />
                )}
            </div>
        );
    };
}

const mapStateToProps = (store: IRootState) => ({

});

const mapDispatchToProps = (dispatch: Dispatch<IObjectAction<Application>>) => {
    // actionName: (newState for that action & its type) => dispatch(ActionCreatorFunction(newState))
    return {
        deleteApplication: (
            applicationToDelete: Application,
            callback?: Function
        ) =>
            dispatch(
                ApplicationActions[CrudType.DELETE][
                    RequestStatus.TRIGGERED
                ].action(applicationToDelete, callback)
            )
    };
};

export const ApplicationComponentController = connect(
    mapStateToProps,
    mapDispatchToProps
)(ApplicationComponent);
