import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { RouteComponentProps } from "react-router";

/** Redux */
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { IRootState } from "../../store/types";
// rest api
import { CrudType, RequestStatus } from "../../utils/rest-api";
import {
    IObjectStore,
    IObjectAction
} from "../../store/rest-api-redux-factory";
import { Company } from "../../store/data-model/company";
import { Link } from "../../store/data-model/link";
import {
    Application,
    ApplicationActions
} from "../../store/data-model/application";
import { ApplicationStatus } from "../../store/data-model/application-status";

/** Components */
import { CompanyApplicationComponentContainer } from "../../components/company-application/company-application-component";
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

interface IUserComAppPageParams {
    uuid: string;
}

interface IUserComAppPageProps
    extends RouteComponentProps<IUserComAppPageParams> {
    companyStore: IObjectStore<Company>;
    applicationStore: IObjectStore<Application>;
    applicationStatusStore: IObjectStore<ApplicationStatus>;

    createApplication: (
        applicationFormData: Application,
        callback?: Function
    ) => void;
}

// interface IUserComAppPageState {
//     companyUuid: string;
//     company: Company;
// }

class UserComAppPage extends Component<
    IUserComAppPageProps
    // IUserComAppPageState
    > {
    // readonly state: IUserComAppPageState = {
    //     companyUuid: "",
    //     company: new Company({})
    // };

    componentDidMount() {
        let companyUuid = this.props.match.params.uuid;
        process.env.NODE_ENV === 'development' && console.log("mount, got uuid from route?", companyUuid);
        // if (
        //     this.props.company.collection &&
        //     companyUuid in this.props.company.collection
        // ) {
        //     this.setState({
        //         companyUuid,
        //         company: new Company(this.props.company.collection[companyUuid])
        //     });
        // }
    }

    renderAll() {
        if (!this.props.match.params.uuid) {
            return;
        }

        const company = this.props.companyStore.collection[this.props.match.params.uuid];
        const applications = Object.values(this.props.applicationStore.collection).filter(
            application =>
                application.user_company === company.uuid
        );

        return (
            <div className={styles.UserCompanyPage}>
                <Button
                    onClick={clickEvent => {
                        // this.props.history.push("/");
                        this.props.history.goBack();
                    }}
                >
                    Back
                </Button>

                <CompanyComponent
                    company={company}
                    onDeleteIconClicked={() => { }}
                    onEditIconClicked={() => {
                        this.props.history.push(`/com-form/${company.uuid}/`);
                    }}
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
                {/* {company.uuid && (
                    <CompanyApplicationComponentContainer
                        company={company}
                        isShowApplicationStatuses
                    />
                )} */}
                {applications.map(application => {
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
                            company={company}
                            applicationStatusList={applicationStatusList}
                            isShowApplicationStatuses
                        />
                    )
                })}

            </div>
        );
    }

    // handle invalid company uuid given in url
    render() {
        return (
            <div className="UserComAppPageContainer">
                {this.props.match.params.uuid &&
                    this.props.companyStore.collection &&
                    this.props.match.params.uuid in this.props.companyStore.collection ? (
                        this.renderAll()
                    ) : this.props.match.params.uuid ? (
                        <h1>No company found. Uuid={this.props.match.params.uuid}</h1>
                    ) : (
                            <h1>Company uuid not specified</h1>
                        )}
            </div>
        );
    }
}

const mapStateToProps = (store: IRootState) => {
    return {
        // prop: store.prop
        companyStore: store.company,
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
                ApplicationActions[CrudType.CREATE][
                    RequestStatus.TRIGGERED
                ].action(applicationFormData, callback)
            )
    };
};

export const UserComAppPageContainer = withRouter(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(UserComAppPage)
);
