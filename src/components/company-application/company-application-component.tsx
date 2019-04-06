import React, { Component } from "react";
import { withRouter, RouteComponentProps } from "react-router-dom";

/** Redux */
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { IRootState } from "../../store/types";
import { IObjectAction, IObjectStore } from "../../store/rest-api-redux-factory";
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
import { ApplicationComponent } from "../application/application-component";


interface ICompanyApplicationComponentProps {
    company: Company;
    applicationStore: IObjectStore<Application>
    applicationStatusStore: IObjectStore<ApplicationStatus>
    isShowApplicationStatuses?: boolean
    deleteObject: (companyToDelete: Company, callback?: Function) => void
}

class CompanyApplicationComponent extends Component<ICompanyApplicationComponentProps> {

    onDeleteClick = (event: any) => {
        if (this.props.company.uuid) {
            this.props.deleteObject(this.props.company);
        } else {
            console.error("Attempted to delete but company obj has no uuid");
        }
    }

    render() {
        return (
            <div className="CompanyApplicationContainer">
                <CompanyComponent company={this.props.company} onDeleteIconClicked={this.onDeleteClick} />
                {Object.values(this.props.applicationStore.collection)
                    .filter(
                        application => application.user_company === this.props.company.uuid
                    )
                    .map(application => {
                        const applicationStatusList = (
                            this.props.isShowApplicationStatuses || false
                        ) ? Object.values(this.props.applicationStatusStore.collection).filter(
                            (applicationStatus) => applicationStatus.application === application.uuid
                        ) : [];
                        return (
                            <ApplicationComponent
                                key={application.uuid}
                                application={application}
                                applicationStatusList={applicationStatusList}
                                isShowApplicationStatuses={this.props.isShowApplicationStatuses}
                            />
                        );
                    })}
                {(!this.props.isShowApplicationStatuses) && <hr />}
            </div>
        );
    }
}

const mapStateToProps = (store: IRootState) => ({
    // prop: store.prop
    applicationStore: store.application,
    applicationStatusStore: store.applicationStatus,
});

const mapDispatchToProps = (dispatch: Dispatch<IObjectAction<Application>>) => {
    // actionName: (newState for that action & its type) => dispatch(ActionCreatorFunction(newState))
    return {
        deleteObject: (companyToDelete: Company, callback?: Function) =>
        	dispatch(
        		CompanyActions[CrudType.DELETE][RequestStatus.TRIGGERED].action(
        			companyToDelete,
        			callback
        		)
        	),
    };
};

export const CompanyApplicationComponentContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(CompanyApplicationComponent);
