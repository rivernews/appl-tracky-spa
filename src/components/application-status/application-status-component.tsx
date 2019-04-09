import React, { Component } from "react";
import { withRouter, RouteComponentProps } from "react-router-dom";

/** Redux */
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { IRootState } from "../../store/types";
import {
    IObjectAction,
    IObjectStore
} from "../../store/rest-api-redux-factory";
import { CrudType, RequestStatus } from "../../utils/rest-api";

/** data model */
import { ApplicationStatus, ApplicationStatusActions } from "../../store/data-model/application-status";
import { ApplicationStatusLink } from "../../store/data-model/application-status-link";

/** Components */
import MaterialIcon from "@material/react-material-icon";
// mdc-react icon button
import '@material/react-icon-button/dist/icon-button.css';
import IconButton from '@material/react-icon-button';


interface IApplicationStatusComponentProps extends RouteComponentProps {
    applicationStatus: ApplicationStatus;
    deleteApplicationStatus: (applicationStatusToDelete: ApplicationStatus, callback?: Function) => void;
}

class ApplicationStatusComponent extends Component<
    IApplicationStatusComponentProps
> {
    render() {
        return (
            <div className="ApplicationStatusComponent">
                <p>
                    <span>Status: {this.props.applicationStatus.text}</span>
                    <IconButton onClick={() => this.props.deleteApplicationStatus(this.props.applicationStatus)}>
                        <MaterialIcon hasRipple icon="delete"/>
                    </IconButton>
                    <br />
                    <span>{this.props.applicationStatus.date}</span>
                    <br />
                    {this.props.applicationStatus.applicationstatuslink_set.map(
                        applicationStatusLink => {
                            console.log("applicationStatusLinkID Obj=", applicationStatusLink);
                            return (
                                (applicationStatusLink && applicationStatusLink.link) && <span key={applicationStatusLink.uuid}>
                                    <a
                                        href={applicationStatusLink.link.url}
                                        target="_blank"
                                    >
                                        {applicationStatusLink.link.text}
                                    </a>{" "}
                                    |{" "}
                                </span>
                            );
                        }
                    )}
                </p>
            </div>
        );
    }
}

const mapStateToProps = (store: IRootState) => ({
    // prop: store.prop
});

const mapDispatchToProps = (dispatch: Dispatch<IObjectAction<ApplicationStatus>>) => {
    // actionName: (newState for that action & its type) => dispatch(ActionCreatorFunction(newState))
    return {
        deleteApplicationStatus: (applicationStatusToDelete: ApplicationStatus, callback?: Function) =>
        	dispatch(
        		ApplicationStatusActions[CrudType.DELETE][RequestStatus.TRIGGERED].action(
        			applicationStatusToDelete,
        			callback
        		)
        	),
    };
};

export const ApplicationStatusComponentContainer = withRouter(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(ApplicationStatusComponent)
);
