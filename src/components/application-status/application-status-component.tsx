import React, { Component } from "react";
import { withRouter, RouteComponentProps } from "react-router-dom";

/** Redux */
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { IRootState } from "../../state-management/types/root-types";
import {
    IObjectAction, IObjectStore, JsonResponseType,
} from "../../state-management/types/factory-types";
import { CrudType, RequestStatus } from "../../utils/rest-api";
import { ApplicationStatusActionCreators } from "../../state-management/action-creators/root-actions";

/** data model */
import { ApplicationStatus } from "../../data-model/application-status/application-status";
import { Application } from "../../data-model/application/application";

/** Components */
import MaterialIcon from "@material/react-material-icon";
// mdc-react icon button
import "@material/react-icon-button/dist/icon-button.css";
import IconButton from "@material/react-icon-button";
// mdc react button
import "@material/react-button/dist/button.css";
import Button from "@material/react-button";
import { ApplicationStatusFormComponentContainer } from "./application-status-form-component";

import Skeleton from 'react-loading-skeleton';


interface IApplicationStatusComponentProps extends RouteComponentProps {
    applicationStatus?: ApplicationStatus;
    application?: Application; // needed by form
    isOnlyForm?: boolean; // needed by add-button

    applicationStatusStore: IObjectStore<ApplicationStatus>;
    deleteApplicationStatus: (
        applicationStatusToDelete: ApplicationStatus,
        callback?: (jsonResponse: JsonResponseType<ApplicationStatus>) => void
    ) => void;
}

interface IApplicationStatusComponentState {
    isFormOpened: boolean;
}

class ApplicationStatusComponent extends Component<
    IApplicationStatusComponentProps,
    IApplicationStatusComponentState
    > {
    state = {
        isFormOpened: false
    };

    render() {
        return (
            <div className="ApplicationStatusComponent">
                {(this.state.isFormOpened || this.props.isOnlyForm) ? (
                    this.renderFormController(
                        this.props.application,
                        this.props.applicationStatus
                    )
                ) : this.renderDisplay(this.props.applicationStatus)
                }
            </div>
        );
    }

    renderDisplay = (applicationStatus?: ApplicationStatus) => {
        return (
            <div className="ApplicationStatusComponent">
                <span>Status: {applicationStatus ? applicationStatus.text : <Skeleton width="20vmin" />}</span>

                {/* edit button */}
                {
                    applicationStatus ? (
                        <IconButton
                            onClick={() => {
                                this.setState({ isFormOpened: true });
                            }}
                        >
                            <MaterialIcon icon="edit" />
                        </IconButton>
                    ) : (
                            <IconButton disabled>
                                <MaterialIcon icon="edit" />
                            </IconButton>
                        )
                }

                {/* delete button */}
                {
                    applicationStatus ? (
                        <IconButton
                            onClick={() =>
                                window.confirm(`Are you sure you want to delete this status? ${applicationStatus.text}`) && this.props.deleteApplicationStatus(
                                    applicationStatus
                                )
                            }
                        >
                            <MaterialIcon icon="delete" />
                        </IconButton>
                    ) : (
                            <IconButton disabled>
                                <MaterialIcon icon="delete" />
                            </IconButton>
                        )
                }

                <div>{applicationStatus ? applicationStatus.date : <Skeleton width="35vmin" />}</div>

                {applicationStatus ? applicationStatus.applicationstatuslink_set.map(
                    applicationStatusLink => {
                        return (
                            applicationStatusLink &&
                            applicationStatusLink.link && (
                                <span key={applicationStatusLink.uuid}>
                                    <a
                                        href={
                                            (
                                                applicationStatusLink.link.url &&
                                                applicationStatusLink.link.url.includes("//")
                                            ) ?
                                                applicationStatusLink.link.url :
                                                `//${applicationStatusLink.link.url}`
                                        }
                                        target="_blank"
                                    >
                                        {applicationStatusLink.link.text}
                                    </a>{" "}
                                    |{" "}
                                </span>
                            )
                        );
                    }
                ) : (
                        <Skeleton width="10vmin" />
                    )}
            </div>
        );
    };

    renderFormController = (
        application?: Application,
        applicationStatus?: ApplicationStatus
    ) => {
        return (
            <div className="application-status-form-controller">
                {/* new application status form */}
                {(
                    !this.state.isFormOpened ||
                    !application // application may be still in requesting state
                ) ? (
                        <Button
                            disabled={!application || this.props.applicationStatusStore.requestStatus === RequestStatus.REQUESTING} // disable action button 
                            onClick={clickEvent => {
                                this.setState({
                                    isFormOpened: true
                                });
                            }}
                            unelevated
                            icon={<MaterialIcon icon="add" />}
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
                                applicationStatus={applicationStatus}
                                onCancel={() => {
                                    this.setState({
                                        isFormOpened: false
                                    });
                                }}
                                onSubmitSuccess={() => {
                                    this.setState({
                                        isFormOpened: false
                                    });
                                }}
                            />
                        </div>
                    )}
            </div>
        );
    };
}

const mapStateToProps = (store: IRootState) => ({
    // prop: store.prop
    applicationStatusStore: store.applicationStatus
});

const mapDispatchToProps = (
    dispatch: Dispatch<IObjectAction<ApplicationStatus>>
) => {
    // actionName: (newState for that action & its type) => dispatch(ActionCreatorFunction(newState))
    return {
        deleteApplicationStatus: (
            applicationStatusToDelete: ApplicationStatus,
            callback?: (jsonResponse: JsonResponseType<ApplicationStatus>) => void
        ) =>
            dispatch(
                ApplicationStatusActionCreators[CrudType.DELETE][
                    RequestStatus.TRIGGERED
                ].action({
                    objectClassInstance: applicationStatusToDelete,
                    successCallback: callback
                })
            )
    };
};

export const ApplicationStatusComponentContainer = withRouter(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(ApplicationStatusComponent)
);
