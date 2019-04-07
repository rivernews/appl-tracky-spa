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

/** data model */
import { ApplicationStatus } from "../../store/data-model/application-status";
import { ApplicationStatusLink } from "../../store/data-model/application-status-link";

/** Components */

interface IApplicationStatusComponentProps extends RouteComponentProps {
    applicationStatus: ApplicationStatus;
}

class ApplicationStatusComponent extends Component<
    IApplicationStatusComponentProps
> {
    render() {
        return (
            <div className="ApplicationStatusComponent">
                <p>
                    <span>Status: {this.props.applicationStatus.text}</span>
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

const mapDispatchToProps = (dispatch: Dispatch<IObjectAction<any>>) => {
    // actionName: (newState for that action & its type) => dispatch(ActionCreatorFunction(newState))
    return {
        // listObjectName: (callback?: Function) =>
        // 	dispatch(
        // 		ObjectNameActions[CrudType.LIST][RequestStatus.TRIGGERED].action(
        // 			new ObjectName({}),
        // 			callback
        // 		)
        // 	),
    };
};

export const ApplicationStatusComponentContainer = withRouter(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(ApplicationStatusComponent)
);
