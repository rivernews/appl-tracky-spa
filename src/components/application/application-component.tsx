import React, { Component } from "react";

/** Redux */
import { connect } from "react-redux";
import { Application } from "../../data-model/application/application";
import { IRootState } from "../../state-management/types/root-types";
import { IObjectAction, IObjectStore, JsonResponseType } from "../../state-management/types/factory-types";
import { Dispatch } from "redux";

/** data model */
import { ApplicationStatus } from "../../data-model/application-status/application-status";
import { Company } from "../../data-model/company/company";

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
import {
    Headline6,
} from '@material/react-typography';
/** CKeditor */
// import CKEditor from '@ckeditor/ckeditor5-react';
import CKEditor from '@shaungc/custom-ckeditor5-react';
// import BalloonEditor from '@ckeditor/ckeditor5-build-balloon';
import BalloonEditor from '@shaungc/ckeditor5-custom-balloon';

import Skeleton from 'react-loading-skeleton';

import styles from './application-component.module.css';
import { ApplicationActionCreators } from "../../state-management/action-creators/root-actions";


/** Types */
interface IApplicationComponentProps {
    application?: Application;

    disableApplicationActionButtons?: boolean

    /** application form */
    company?: Company;

    isOnlyForm?: boolean;

    applicationStatusList?: Array<ApplicationStatus>;

    /** redux */
    applicationStatusStore: IObjectStore<ApplicationStatus>;

    deleteApplication: (
        applicationToDelete: Application,
        callback?: (jsonResponse: JsonResponseType<Application>) => void,
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
        if (!this.state.isFormOpened && this.props.isOnlyForm) {  // company may still be in requesting state, when attempt to render form
            return (
                <Button
                    disabled={!this.props.company}
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
            )
        }

        return (
            <div className={styles.applicationCard}>
                <div className={styles.applicationCardContent}>
                    {(!this.state.isFormOpened && !this.props.isOnlyForm) ? (
                        this.renderApplicationDisplay(
                            this.props.application,
                            this.props.applicationStatusList
                        )
                    ) : (
                            this.renderApplicationFormController()
                        )}
                </div>
            </div>

        )
    }

    renderApplicationFormController = () => {
        return this.props.company && (
            // application create or udpate must have company associate with it.
            <div className="application-form-controller">
                <h2>{this.props.application ? "Edit Application" : "New Application"}</h2>
                <ApplicationFormComponentContainer
                    onCancel={event => {
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
            </div>
        );
    };

    renderApplicationDisplay = (
        application?: Application,
        applicationStatusList: Array<ApplicationStatus> = []
    ) => {

        return (
            <div className="application-component-display">
                {/* application display view */}
                <h2>{application ? application.position_title : <Skeleton />}
                    {/* external link icon */}
                    {
                        application ? (
                            <IconButton
                                disabled={application.job_description_page?.url == "#"}
                                isLink={application.job_description_page?.url != "#"} target="_blank" href={application.job_description_page?.url && application.job_description_page.url.includes("//") ?
                                    application.job_description_page.url :
                                    `//${application.job_description_page?.url}`}
                            >
                                <MaterialIcon hasRipple icon="launch" />
                            </IconButton>
                        ) : (
                                <IconButton disabled>
                                    <MaterialIcon hasRipple icon="launch" />
                                </IconButton>
                            )
                    }

                    {/* external link icon */}
                    {
                        application ? (
                            <IconButton
                                disabled={application.job_source?.url == "#"}
                                isLink={application.job_source?.url != "#"} target="_blank" href={application.job_source?.url && application.job_source.url.includes("//") ?
                                    application.job_source.url :
                                    `//${application.job_source?.url}`}
                            >
                                <MaterialIcon hasRipple icon="language" />
                            </IconButton>
                        ) : (
                                <IconButton disabled>
                                    <MaterialIcon hasRipple icon="language" />
                                </IconButton>
                            )
                    }

                    {/* application actions */}
                    {
                        application ? (
                            <IconButton
                                disabled={this.props.disableApplicationActionButtons}
                                onClick={() => {
                                    this.setState({
                                        isFormOpened: true // open form and close display
                                    });
                                }}
                            >
                                <MaterialIcon hasRipple icon="edit" />
                            </IconButton>
                        ) : (
                                <IconButton disabled>
                                    <MaterialIcon hasRipple icon="edit" />
                                </IconButton>
                            )
                    }

                    {
                        application ? (
                            <IconButton
                                disabled={this.props.disableApplicationActionButtons}
                                onClick={() =>
                                    window.confirm(`Are you sure you want to delete ${application.position_title}?`) && this.props.deleteApplication(application)
                                }
                            >
                                <MaterialIcon hasRipple icon="delete" />
                            </IconButton>
                        ) : (
                                <IconButton disabled>
                                    <MaterialIcon hasRipple icon="delete" />
                                </IconButton>
                            )
                    }
                </h2>

                {/* general notes */}
                <div className="applicationNotesRichText">
                    <h3>Quick Notes</h3>
                    {application ? (application.notes ? (
                        <CKEditor
                            editor={BalloonEditor}
                            disabled={true}
                            data={application.notes}
                        />

                    ) : (
                            <p>
                                No notes yet.
                            </p>
                        )) : (
                            <div>
                                <div><Skeleton width="70vmin" /></div>
                                <div><Skeleton width="30vmin" /></div>
                                <div><Skeleton width="50vmin" /></div>
                            </div>
                        )}
                </div>

                {/* job description notes */}
                <div className="applicationNotesRichText">
                    <h3>Job Description Notes</h3>
                    {application ? (application.job_description_notes ? (
                        <CKEditor
                            editor={BalloonEditor}
                            disabled={true}
                            data={application.job_description_notes}
                        />

                    ) : (
                            <p>
                                No job description notes yet.
                            </p>
                        )) : (
                            <div>
                                <div><Skeleton width="60vmin" /></div>
                                <div><Skeleton width="30vmin" /></div>
                                <div><Skeleton width="80vmin" /></div>
                            </div>
                        )}
                </div>

                {/* application statuses list */}
                <div className="statusContainer">
                    <Headline6>Status</Headline6>

                    {/* application status form controller */}
                    {
                        <ApplicationStatusComponentContainer
                            application={application}
                            isOnlyForm
                        />
                    }

                    {
                        /* show skeleton to indicate application status is loading */
                        (this.props.applicationStatusStore.requestStatus === RequestStatus.REQUESTING) && (
                            <ApplicationStatusComponentContainer />
                        )
                    }

                    {
                        application && (
                            applicationStatusList.map((applicationStatus, index) => {
                                return (
                                    <ApplicationStatusComponentContainer
                                        key={index}
                                        applicationStatus={applicationStatus}
                                        application={application}
                                    />
                                );
                            })
                        )
                    }
                </div>
            </div>
        );
    };
}

const mapStateToProps = (store: IRootState) => ({
    applicationStatusStore: store.applicationStatus
});

const mapDispatchToProps = (dispatch: Dispatch<IObjectAction<Application>>) => {
    // actionName: (newState for that action & its type) => dispatch(ActionCreatorFunction(newState))
    return {
        deleteApplication: (
            applicationToDelete: Application,
            callback?: (jsonResponse: JsonResponseType<Application>) => void
        ) =>
            dispatch(
                ApplicationActionCreators[CrudType.DELETE][
                    RequestStatus.TRIGGERED
                ].action({
                    objectClassInstance: applicationToDelete, 
                    successCallback: callback
                })
            )
    };
};

export const ApplicationComponentController = connect(
    mapStateToProps,
    mapDispatchToProps
)(ApplicationComponent);
