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

interface IUserComAppPageParams {
    uuid: string;
}

interface IUserComAppPageProps
    extends RouteComponentProps<IUserComAppPageParams> {
    company: IObjectStore<Company>;
    createApplication: (
        applicationFormData: Application,
        callback?: Function
    ) => void;
}

interface IUserComAppPageState {
    companyUuid: string;
    company: Company;
}

class UserComAppPage extends Component<
    IUserComAppPageProps,
    IUserComAppPageState
> {
    readonly state: IUserComAppPageState = {
        companyUuid: "",
        company: new Company({})
    };

    componentDidMount() {
        let companyUuid = this.props.match.params.uuid;
        console.log("mount, got uuid from route?", companyUuid);
        if (
            this.props.company.collection &&
            companyUuid in this.props.company.collection
        ) {
            this.setState({
                companyUuid,
                company: new Company(this.props.company.collection[companyUuid])
            });
        }
    }

    renderAll() {
        if (!this.state.company.uuid) {
            return;
        }

        return (
            <div className="user-com-app-page-content">
                <Button
                    onClick={clickEvent => {
                        this.props.history.push("/");
                    }}
                >
                    Back
                </Button>
                <h1>{this.state.company.name}</h1>
                
                {/* application form controller - always create form */}
                <ApplicationComponentController 
                    company={this.state.company}
                    isOnlyForm
                />

                <br />

                {/* application list */}
                {this.state.company.uuid && (
                    <CompanyApplicationComponentContainer
                        company={this.state.company}
                        isShowApplicationStatuses
                    />
                )}
            </div>
        );
    }

    render() {
        return (
            <div className="UserComAppPage">
                {this.state.companyUuid &&
                this.props.company.collection &&
                this.state.companyUuid in this.props.company.collection ? (
                    this.renderAll()
                ) : this.state.companyUuid ? (
                    <h1>No company found. Uuid={this.state.companyUuid}</h1>
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
        company: store.company,
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
