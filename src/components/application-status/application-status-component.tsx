import React, { Component } from "react";
import { withRouter, RouteComponentProps } from "react-router-dom";

/** Redux */
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { IRootState } from "../../store/types";
import {
    IObjectAction,
} from "../../store/rest-api-redux-factory";
import { CrudType, RequestStatus } from "../../utils/rest-api";

/** data model */
import {
    ApplicationStatus,
    ApplicationStatusActions
} from "../../store/data-model/application-status";
import { Application } from "../../store/data-model/application";

/** Components */
import MaterialIcon from "@material/react-material-icon";
// mdc-react icon button
import "@material/react-icon-button/dist/icon-button.css";
import IconButton from "@material/react-icon-button";
// mdc react button
import "@material/react-button/dist/button.css";
import Button from "@material/react-button";
import { ApplicationStatusFormComponentContainer } from "./application-status-form-component";

interface IApplicationStatusComponentProps extends RouteComponentProps {
    applicationStatus?: ApplicationStatus;
    application?: Application; // needed by form
    isOnlyForm?: boolean; // needed by add-button
    deleteApplicationStatus: (
        applicationStatusToDelete: ApplicationStatus,
        callback?: Function
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
                {(this.state.isFormOpened || this.props.isOnlyForm) && this.props.application ? (
                    this.renderFormController(
                        this.props.application,
                        this.props.applicationStatus
                    )
                ) : this.props.applicationStatus ? (
                    this.renderDisplay(this.props.applicationStatus)
                ) : (
                    <span>
                        Nothing to render: no application status provided so
                        cannot display; no application provided so form for
                        create/update are not allowed.
                    </span>
                )}
            </div>
        );
    }

    renderDisplay = (applicationStatus: ApplicationStatus) => {
        return (
            <div className="ApplicationStatusComponent">
                <p>
                    <span>Status: {applicationStatus.text}</span>
                    <IconButton
                        onClick={() => {
                            console.log("application status component: edit button clicked.")
                            this.setState({isFormOpened: true});
                        }}
                    >
                        <MaterialIcon hasRipple icon="edit" />
                    </IconButton>
                    <IconButton
                        onClick={() =>
                            this.props.deleteApplicationStatus(
                                applicationStatus
                            )
                        }
                    >
                        <MaterialIcon hasRipple icon="delete" />
                    </IconButton>
                    <br />
                    <span>{applicationStatus.date}</span>
                    <br />
                    {applicationStatus.applicationstatuslink_set.map(
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
                    )}
                </p>
            </div>
        );
    };

    renderFormController = (
        application: Application,
        applicationStatus?: ApplicationStatus
    ) => {
        return (
            <div className="application-status-form-controller">
                {/* new application status form */}
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
                            onCancel={clickEvent => {
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
});

const mapDispatchToProps = (
    dispatch: Dispatch<IObjectAction<ApplicationStatus>>
) => {
    // actionName: (newState for that action & its type) => dispatch(ActionCreatorFunction(newState))
    return {
        deleteApplicationStatus: (
            applicationStatusToDelete: ApplicationStatus,
            callback?: Function
        ) =>
            dispatch(
                ApplicationStatusActions[CrudType.DELETE][
                    RequestStatus.TRIGGERED
                ].action(applicationStatusToDelete, callback)
            )
    };
};

export const ApplicationStatusComponentContainer = withRouter(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(ApplicationStatusComponent)
);
