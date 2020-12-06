import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { RouteComponentProps } from "react-router";

/** Redux */
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { IRootState } from "../../state-management/types/root-types";
// rest api
import { CrudType, RequestStatus } from "../../utils/rest-api";
import {
    IObjectStore,
    IObjectAction
} from "../../state-management/types/factory-types";
import { Company, labelTypesMapToCompanyGroupTypes, companyGroupTypes } from "../../data-model/company/company";
import { Application } from "../../data-model/application/application";
import { ApplicationStatus } from "../../data-model/application-status/application-status";

/** Components */
// mdc react icon
import MaterialIcon from "@material/react-material-icon";
// mdc react button
import "@material/react-button/dist/button.css";
import Button from "@material/react-button";
// mdc-react input
import "@material/react-text-field/dist/text-field.css";
import { ApplicationComponentController } from "../../components/application/application-component";
import { CompanyComponent } from "../../components/company/company-component";

import styles from "./user-com-app-page.module.css";
import { IReference } from "../../data-model/base-model";
import { CompanyActionCreators, ApplicationActionCreators } from "../../state-management/action-creators/root-actions";


interface IUserComAppPageParams {
    uuid: string;
}

interface IUserComAppPageNoGroupCompanyProps
    extends RouteComponentProps<IUserComAppPageParams> {
    companyStore: IObjectStore<Company>;
    applicationStore: IObjectStore<Application>;
    applicationStatusStore: IObjectStore<ApplicationStatus>;

    createApplication: (
        applicationFormData: Application,
        callback?: Function
    ) => void;

    deleteCompany: (companyToDelete: Company, callback?: Function) => void;
    updateCompany: (companyToUpdate: Company, callback?: Function) => void;
}

type IUserComAppPageProps = IUserComAppPageNoGroupCompanyProps & {
    [key in companyGroupTypes]: IObjectStore<Company>
}

class UserComAppPage extends Component<IUserComAppPageProps> {
    componentDidMount() {
        const companyUuid = this.props.match.params.uuid;
    }

    goBackToCompanyListPage = () => {
        this.props.history.replace('/home/');
    }

    onCompanyDelete = () => {
        if (this.props.match.params.uuid) {
            const company = this.props.companyStore.collection[this.props.match.params.uuid];
            window.confirm(`Are you sure you want to delete company ${company.name}?`) && this.props.deleteCompany(company, this.goBackToCompanyListPage);
            return;
        }

        console.error("Attempted to delete but company obj has no uuid");
    }

    onCompanyEdit = () => {
        if (this.props.match.params.uuid) {
            const company = this.props.companyStore.collection[this.props.match.params.uuid];
            this.props.history.push(`/com-form/${company.uuid}/`);
            return;
        }

        console.error("Attempted to edit but no company uuid provided");
    }

    renderPage() {
        if (!this.props.match.params.uuid) {
            return;
        }

        const company = this.props.companyStore.collection[this.props.match.params.uuid];
        const applications = company ? company.applications as Array<IReference> : [];

        return (
            <div className={styles.UserCompanyPage}>
                <Button
                    onClick={_ => {
                        this.props.history.length > 1 ? this.props.history.goBack()  : this.props.history.push('/home/');
                    }}
                >
                    Back
                </Button>

                <CompanyComponent
                    company={company}
                    onDeleteIconClicked={this.onCompanyDelete}
                    onEditIconClicked={this.onCompanyEdit}
                    actionButtonsDisabled={this.props.companyStore.requestStatus === RequestStatus.REQUESTING}
                />

                <h2>Your Applications</h2>
                {/* add application button - application form controller - always create form */}
                <div>
                    <ApplicationComponentController
                        company={company}
                        isOnlyForm
                    />
                </div>

                {/* application list */}
                {company ? applications.map((applicationRef, applicationsIndex) => {
                    const application = this.props.applicationStore.collection[applicationRef as IReference];

                    const applicationStatusList =  application ? (application.statuses as Array<IReference>).map((statusUuid) => this.props.applicationStatusStore.collection[statusUuid]) : undefined;
                    return (
                        <ApplicationComponentController
                            key={applicationsIndex}
                            application={application}
                            company={company}
                            applicationStatusList={applicationStatusList}
                            disableApplicationActionButtons={this.props.applicationStore.requestStatus === RequestStatus.REQUESTING}
                        />
                    )
                }) : (
                    <ApplicationComponentController 
                        disableApplicationActionButtons
                    />
                )}

            </div>
        );
    }

    renderController() {
        if (!this.props.match.params.uuid) {
            return <h1>Company uuid not specified</h1>
        }

        // if such company in store, just take it
        if (this.props.match.params.uuid in this.props.companyStore.collection) {
            return this.renderPage();
        }

        // need to really make sure company not found in database
        // will not show "not found" till all requesting finish
        let someStillRequesting: boolean = false;
        for (const companyGroupText of Object.values(labelTypesMapToCompanyGroupTypes)) {
            if (
                this.props[companyGroupText].requestStatus !== RequestStatus.SUCCESS ||
                this.props[companyGroupText].requestStatus !== RequestStatus.FAILURE
            ) {
                someStillRequesting = true;
                break;
            }
        }

        if (
            !someStillRequesting &&
            !(this.props.match.params.uuid in this.props.companyStore.collection)
        ) {
            return <h1>Company not found</h1>
        }

        return this.renderPage();
    }

    // handle invalid company uuid given in url
    render() {
        return (
            <div className="UserComAppPageContainer">
                {this.renderController()}
            </div>
        );
    }
}

const mapStateToProps = (store: IRootState) => {
    return {
        // prop: store.prop
        companyStore: store.company,
        ...(Object.values(labelTypesMapToCompanyGroupTypes).reduce((accumulate, companyGroupText) => ({
            ...accumulate,
            [companyGroupText]: store[companyGroupText]
        }), {})),
        applicationStore: store.application,
        applicationStatusStore: store.applicationStatus
    };
};

const mapDispatchToProps = (dispatch: Dispatch<IObjectAction<Application>>) => {
    // actionName = (newState for that action & its type) => dispatch(ActionCreatorFunction(newState))
    return {
        createApplication: (
            applicationFormData: Application,
            callback?: Function
        ) =>
            dispatch(
                ApplicationActionCreators[CrudType.CREATE][
                    RequestStatus.TRIGGERED
                ].action(applicationFormData, callback)
            )
        ,
        deleteCompany: (companyToDelete: Company, callback?: Function) =>
            dispatch(
                CompanyActionCreators[CrudType.DELETE][RequestStatus.TRIGGERED].action(
                    companyToDelete,
                    callback
                )
            ),
        updateCompany: (companyToUpdate: Company, callback?: Function) =>
            dispatch(
                CompanyActionCreators[CrudType.UPDATE][RequestStatus.TRIGGERED].action(
                    companyToUpdate,
                    callback
                )
            )
    };
};

export const UserComAppPageContainer = withRouter(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(UserComAppPage)
);
