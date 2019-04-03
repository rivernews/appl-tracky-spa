import React, { Component } from "react";
import { Link } from "react-router-dom";

/** Redux */
import { Application } from "../../store/data-model/application";

/** Components */
// mdc react icon
import MaterialIcon from "@material/react-material-icon";
// mdc react button
import "@material/react-button/dist/button.css";
import Button from "@material/react-button";
import { ApplicationStatusFormComponentContainer } from "../../components/application-status/application-status-form-component";

/** Types */
interface IApplicationComponentProps {
    application: Application;
}

interface IApplicationComponentState {
    isApplicationStatusFormOpened: boolean;
}

/** Main Class */
export class ApplicationComponent extends Component<
    IApplicationComponentProps,
    IApplicationComponentState
> {
    state = {
        isApplicationStatusFormOpened: false
    };

    render() {
        const application = this.props.application;
        return application.uuid ? (
            <div className="ApplicationComponent">
                <p>
                    <span>
                        <strong>Position:</strong> {application.position_title}
                    </span>
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

                <Button
                    onClick={clickEvent => {
                        this.setState({ isApplicationStatusFormOpened: true });
                    }}
                    unelevated
                    icon={<MaterialIcon hasRipple icon="add" />}
                >
                    Add New Status
                </Button>

                {this.state.isApplicationStatusFormOpened && (
                    <div className="application-status-form">
                        Application status form here!
                        <ApplicationStatusFormComponentContainer 
                            onCancel={clickEvent => {
                                this.setState({
                                    isApplicationStatusFormOpened: false
                                });
                            }}
                        />
                    </div>
                )}
            </div>
        ) : (
            <span>application object has no uuid.</span>
        );
    }
}
