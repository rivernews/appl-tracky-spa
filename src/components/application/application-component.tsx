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
                    {
                        (application.job_description_page.url) ?
                        <a target="_blank" href={application.job_description_page.url}>
                            <strong>JD Page</strong>
                        </a>
                        :
                        <span>JD Page</span>
                    }
                    
                    <br />
                    {
                        (application.job_source.url) ?
                        <a target="_blank" href={application.job_source.url}>
                            <strong>Job Source</strong>
                        </a>
                        :
                        <span>Job Source</span>
                    }
                </p>
            </div>
        );
    }
}
