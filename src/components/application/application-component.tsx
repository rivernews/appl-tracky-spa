import React, { Component } from "react";
import { Link } from "react-router-dom";

/** Redux */
import { Application } from "../../store/data-model/application";

/** data model */
import { ApplicationStatus } from "../../store/data-model/application-status";
import { Company } from "../../store/data-model/company";

/** Components */
// mdc react icon
import MaterialIcon from "@material/react-material-icon";
// mdc react button
import "@material/react-button/dist/button.css";
import Button from "@material/react-button";
import { ApplicationStatusFormComponentContainer } from "../../components/application-status/application-status-form-component";
import { ApplicationStatusComponentContainer } from "../application-status/application-status-component";
import { ApplicationFormComponentContainer } from "./application-form-component";

/** Types */
interface IApplicationComponentProps {
    application?: Application;

    /** application form */
    company?: Company;

    applicationStatusList?: Array<ApplicationStatus>;
    isShowApplicationStatuses?: boolean;
}

interface IApplicationComponentState {
    isApplicationStatusFormOpened: boolean;
    isApplicationFormOpened: boolean;
}

/** Main Class */
export class ApplicationComponent extends Component<
    IApplicationComponentProps,
    IApplicationComponentState
> {
    state = {
        isApplicationStatusFormOpened: false,
        isApplicationFormOpened: false
    };

    render() {
        return (
            <div className="application-component">
                {this.props.application
                    ? this.renderApplicationDisplay()
                    : this.renderApplicationFormController()}
            </div>
        );
    }

    renderApplicationFormController = () => {
        return (
            this.props.company && ( // application create or udpate must have company associate with it.
                <div className="application-form-controller">
                    {!this.state.isApplicationFormOpened ? (
                        <Button
                            onClick={clickEvent => {
                                this.setState({
                                    isApplicationFormOpened: true
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
                                    isApplicationFormOpened: false
                                });
                            }}
                            onSubmitSuccess={() =>
                                this.setState({
                                    isApplicationFormOpened: false
                                })
                            }
                            company={this.props.company}
                        />
                    )}
                </div>
            )
        );
    };

    renderApplicationDisplay = () => {
        const application = this.props.application;

        if (!(application && this.props.applicationStatusList)) {
            return;
        }

        return (
            <div className="application-component-display">
                {/* application display view */}
                <p>
                    <span>
                        <strong>Position:</strong> {application.position_title}
                    </span>
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
                    this.props.applicationStatusList.map(status => {
                        return (
                            <ApplicationStatusComponentContainer
                                key={status.uuid}
                                applicationStatus={status}
                            />
                        );
                    })}

                {/* new application status form */}
                {this.props.isShowApplicationStatuses &&
                    (!this.state.isApplicationStatusFormOpened ? (
                        <Button
                            onClick={clickEvent => {
                                this.setState({
                                    isApplicationStatusFormOpened: true
                                });
                            }}
                            unelevated
                            icon={<MaterialIcon hasRipple icon="add" />}
                        >
                            Add New Status
                        </Button>
                    ) : (
                        <div className="application-component__status-form">
                            <h3>
                                Add new status to application for{" "}
                                {application.position_title}{" "}
                            </h3>
                            <ApplicationStatusFormComponentContainer
                                application={application}
                                onCancel={clickEvent => {
                                    this.setState({
                                        isApplicationStatusFormOpened: false
                                    });
                                }}
                                onSubmitSuccess={() => {
                                    this.setState({
                                        isApplicationStatusFormOpened: false
                                    });
                                }}
                            />
                        </div>
                    ))}
            </div>
        );
    };
}
