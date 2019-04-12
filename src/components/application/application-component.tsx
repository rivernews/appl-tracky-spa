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
                                console.log("onCancel clicked");
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
                    {application.job_description_page.url ? (
                        <a
                            target="_blank"
                            href={application.job_description_page.url}
                        >
                            <strong>JD Page</strong>
                        </a>
                    ) : (
                        <span>JD Page</span>
                    )}

                    <br />
                    {application.job_source.url ? (
                        <a target="_blank" href={application.job_source.url}>
                            <strong>Job Source</strong>
                        </a>
                    ) : (
                        <span>Job Source</span>
                    )}
                </p>

                {/* application statuses list */}
                {this.props.isShowApplicationStatuses &&
                    applicationStatusList.map(status => {
                        return (
                            <ApplicationStatusComponentContainer
                                key={status.uuid}
                                applicationStatus={status}
                            />
                        );
                    })}

                {/* application status form controller */}
                <ApplicationStatusComponentContainer
                    application={application}
                    isOnlyForm
                />
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
