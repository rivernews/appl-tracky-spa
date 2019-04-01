import React, { Component } from "react";
import { Link } from "react-router-dom";

/** Redux */
import { Application } from "../../store/data-model/application";

/** Components */

interface IApplicationComponentProps {
    application: Application;
}

export class ApplicationComponent extends Component<IApplicationComponentProps> {
    render() {
        const application = this.props.application;
        return (
            <div className="ApplicationComponent">
                <p>
                    <span>
                        <strong>Position:</strong> {application.position_title}
                    </span>
                    <br />
                    <a target="_blank" href={application.job_description_page.url}>
                        <strong>JD Page</strong>
                    </a>
                    <br />
                    <a target="_blank" href={application.job_source.url}>
                        <strong>Job Source</strong>
                    </a>
                </p>
            </div>
        );
    }
}
