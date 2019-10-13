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
// data models
import { CompanyActions, Company } from "../../store/data-model/company";
import {
    ApplicationActions,
    Application
} from "../../store/data-model/application";
import { ApplicationStatus } from "../../store/data-model/application-status";

/** Components */
// objects
import { CompanyComponent } from "../company/company-component";
import { ApplicationComponentController } from "../application/application-component";

interface ICompanyApplicationComponentProps extends RouteComponentProps {
    company: Company;
    applicationStore: IObjectStore<Application>;
    applicationStatusStore: IObjectStore<ApplicationStatus>;
    isShowApplicationStatuses?: boolean;
    deleteCompany: (companyToDelete: Company, callback?: Function) => void;
    updateCompany: (companyToUpdate: Company, callback?: Function) => void;
}

class CompanyApplicationComponent extends Component<
    ICompanyApplicationComponentProps
> {
    onDeleteClick = (event: any) => {
        if (this.props.company.uuid) {
            this.props.deleteCompany(this.props.company);
        } else {
            console.error("Attempted to delete but company obj has no uuid");
        }
    };

    render() {
        return (
            <div className="CompanyApplicationContainer">
                {/* <CompanyComponent
                    company={this.props.company}
                    onDeleteIconClicked={this.onDeleteClick}
                    onEditIconClicked={() => {
                        this.props.history.push(`/com-form/${this.props.company.uuid}/`);
                    }}
                /> */}
                {Object.values(this.props.applicationStore.collection)
                    .filter(
                        application =>
                            application.user_company === this.props.company.uuid
                    )
                    .map(application => {
                        if (this.props.isShowApplicationStatuses) {
                            const applicationStatusList = Object.values(
                                      this.props.applicationStatusStore
                                          .collection
                                  ).filter(
                                      applicationStatus =>
                                          applicationStatus.application ===
                                          application.uuid
                                  );
                            return (
                                <ApplicationComponentController
                                    key={application.uuid}
                                    application={application}
                                    company={this.props.company}
                                    applicationStatusList={applicationStatusList}
                                    isShowApplicationStatuses={
                                        this.props.isShowApplicationStatuses
                                    }
                                /> 
                            )
                        }
                        else {
                            return (
                                <div key={application.uuid}>
                                    {application.position_title}
                                </div>
                            )
                        }
                    })}
                {!this.props.isShowApplicationStatuses && <hr />}
            </div>
        );
    }
}

const mapStateToProps = (store: IRootState) => ({
    // prop: store.prop
    applicationStore: store.application,
    applicationStatusStore: store.applicationStatus
});

const mapDispatchToProps = (dispatch: Dispatch<IObjectAction<Application>>) => {
    // actionName: (newState for that action & its type) => dispatch(ActionCreatorFunction(newState))
    return {
        deleteCompany: (companyToDelete: Company, callback?: Function) =>
            dispatch(
                CompanyActions[CrudType.DELETE][RequestStatus.TRIGGERED].action(
                    companyToDelete,
                    callback
                )
            ),
        updateCompany: (companyToUpdate: Company, callback?: Function) =>
            dispatch(
                CompanyActions[CrudType.UPDATE][RequestStatus.TRIGGERED].action(
                    companyToUpdate,
                    callback
                )
            )
    };
};

export const CompanyApplicationComponentContainer = withRouter(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(CompanyApplicationComponent)
);
