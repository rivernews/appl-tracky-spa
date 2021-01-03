import React, { useEffect } from "react";
import { withRouter } from "react-router-dom";
import { RouteComponentProps } from "react-router";

/** Redux */
import { connect, useDispatch } from "react-redux";
import { Dispatch } from "redux";
import { IRootState } from "../../state-management/types/root-types";
// rest api
import { CrudType, RequestStatus, RestApiService } from "../../utils/rest-api";
import {
    IObjectStore,
    IObjectAction,
    JsonResponseType
} from "../../state-management/types/factory-types";
import { Company, labelTypesMapToCompanyGroupTypes, companyGroupTypes } from "../../data-model/company/company";
import { Application } from "../../data-model/application/application";
import { ApplicationStatus } from "../../data-model/application-status/application-status";

/** Components */
// mdc react button
import "@material/react-button/dist/button.css";
import Button from "@material/react-button";
// mdc-react input
import "@material/react-text-field/dist/text-field.css";
import { ApplicationComponentController } from "../../components/application/application-component";
import { CompanyComponent } from "../../components/company/company-component";

import styles from "./user-com-app-page.module.css";
import { IReference } from "../../data-model/base-model";
import { CompanyActionCreators, ApplicationActionCreators, GroupedCompanyActionCreators } from "../../state-management/action-creators/root-actions";


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
        callback?: (jsonResponse: JsonResponseType<Application>) => void
    ) => void;

    deleteCompany: (companyToDelete: Company, callback?: (jsonResponse: JsonResponseType<Company>) => void) => void;
    updateCompany: (companyToUpdate: Company, callback?: (jsonResponse: JsonResponseType<Company>) => void) => void;
}

type IUserComAppPageProps = IUserComAppPageNoGroupCompanyProps & {
    [key in companyGroupTypes]: IObjectStore<Company>
}

export const UserComAppPage = (props: IUserComAppPageProps) => {
    const companyUuid = props.match.params.uuid;
    const company = props.companyStore.collection[companyUuid];
    const dispatch = useDispatch();

    useEffect(() => {
        if (companyUuid) {
            if (company && !company.modified_at && props.companyStore.requestStatus !== RequestStatus.REQUESTING) {
                dispatch(
                    CompanyActionCreators[CrudType.READ][RequestStatus.TRIGGERED].action({
                        absoluteUrl: `${RestApiService.state.apiBaseUrl}companies/${companyUuid}/`,
                        // TODO: optimize whenever necessary so that we don't need to fetch everything upon login
                        // when we're only visiting the detial page; still, a paginated solution in home page would be better
                        //
                        // Currently, no need to dispatch grouped company because auth-saga will fetch everything upon login 
                        //
                        // successCallback: (company) => {
                        //     console.log('success group')
                        //     company = company as Company;
                        //     const label = company.labels ? company.labels[0].text : labelTypes.TARGET;
                        //     dispatch(
                        //         GroupedCompanyActionCreators[
                        //             labelTypesMapToCompanyGroupTypes[label]
                        //         ][CrudType.READ][RequestStatus.SUCCESS].action(company)
                        //     );
                        // }
                    })
                )
            }
        }
    }, [company, companyUuid])


    const goBackToCompanyListPage = () => {
        props.history.replace('/home/');
    }

    const onCompanyDelete = () => {
        if (props.match.params.uuid) {
            window.confirm(`Are you sure you want to delete company ${company.name}?`) && props.deleteCompany(company, goBackToCompanyListPage);
            return;
        }

        console.error("Attempted to delete but company obj has no uuid");
    }

    const onCompanyEdit = () => {
        if (props.match.params.uuid) {
            const company = props.companyStore.collection[props.match.params.uuid];
            props.history.push(`/com-form/${company.uuid}/`);
            return;
        }

        console.error("Attempted to edit but no company uuid provided");
    }

    const renderPage = () => {
        if (!props.match.params.uuid) {
            return;
        }

        const company = props.companyStore.collection[props.match.params.uuid];
        const applications = company ? company.applications as Array<IReference> : [];

        return (
            <div className={styles.UserCompanyPage}>
                <Button
                    onClick={_ => {
                        props.history.length > 1 ? props.history.goBack()  : props.history.push('/home/');
                    }}
                >
                    Back
                </Button>

                <CompanyComponent
                    company={company}
                    onDeleteIconClicked={onCompanyDelete}
                    onEditIconClicked={onCompanyEdit}
                    actionButtonsDisabled={props.companyStore.requestStatus === RequestStatus.REQUESTING}
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
                    const application = props.applicationStore.collection[applicationRef as IReference];
                    const applicationStatusList =  application ? ((application.statuses || []) as Array<IReference>).map((statusUuid) => props.applicationStatusStore.collection[statusUuid]) : undefined;
                    return (
                        <ApplicationComponentController
                            key={applicationsIndex}
                            application={application}
                            company={company}
                            applicationStatusList={applicationStatusList}
                            disableApplicationActionButtons={props.applicationStore.requestStatus === RequestStatus.REQUESTING}
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

    const renderController = () => {
        if (!props.match.params.uuid) {
            return <h1>Company uuid not specified</h1>
        }

        // if such company in store, just take it
        if (props.match.params.uuid in props.companyStore.collection) {
            return renderPage();
        }

        // need to really make sure company not found in database
        // will not show "not found" till all requesting finish
        let someStillRequesting: boolean = false;
        for (const companyGroupText of Object.values(labelTypesMapToCompanyGroupTypes)) {
            if (
                props[companyGroupText].requestStatus !== RequestStatus.SUCCESS ||
                props[companyGroupText].requestStatus !== RequestStatus.FAILURE
            ) {
                someStillRequesting = true;
                break;
            }
        }

        if (
            !someStillRequesting &&
            !(props.match.params.uuid in props.companyStore.collection)
        ) {
            return <h1>Company not found</h1>
        }

        return renderPage();
    }

    // handle invalid company uuid given in url
    return (
        <div className="UserComAppPageContainer">
            {renderController()}
        </div>
    );
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

const mapDispatchToProps = (dispatch: Dispatch<IObjectAction<Application | Company>>) => {
    // actionName = (newState for that action & its type) => dispatch(ActionCreatorFunction(newState))
    return {
        createApplication: (
            applicationFormData: Application,
            callback?: (jsonResponse: JsonResponseType<Application>) => void
        ) =>
            dispatch(
                ApplicationActionCreators[CrudType.CREATE][
                    RequestStatus.TRIGGERED
                ].action({
                    objectClassInstance: applicationFormData,
                    successCallback: callback
                })
            )
        ,
        deleteCompany: (companyToDelete: Company, successCallback?: (jsonResponse: JsonResponseType<Company>) => void) =>
            dispatch(
                CompanyActionCreators[CrudType.DELETE][RequestStatus.TRIGGERED].action({
                    objectClassInstance: companyToDelete,
                    successCallback
                })
            ),
        updateCompany: (companyToUpdate: Company, successCallback?: (jsonResponse: JsonResponseType<Company>) => void) =>
            dispatch(
                CompanyActionCreators[CrudType.UPDATE][RequestStatus.TRIGGERED].action({
                    objectClassInstance: companyToUpdate,
                    successCallback
                })
            )
    };
};

export const UserComAppPageContainer = withRouter(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(UserComAppPage)
);
