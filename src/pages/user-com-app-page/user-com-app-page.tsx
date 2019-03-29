import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { RouteComponentProps } from "react-router";

/** Redux */
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { IRootState } from "../../store/types";
// rest api
import { IObjectStore } from "../../store/rest-api-redux-factory";
import { Address } from "../../store/data-model/address";
import { Company } from "../../store/data-model/company";

/** Components */
import { CompanyComponent } from "../../components/company/company-component";

interface IUserComAppPageParams {
    uuid: string;
}

interface IUserComAppPageProps
    extends RouteComponentProps<IUserComAppPageParams> {
    address: IObjectStore<Address>;
}

class UserComAppPage extends Component<IUserComAppPageProps> {
    
    renderCompany(companyUuid: string) {
        const company = new Company(this.props.address.objectList[companyUuid]);
        return <CompanyComponent company={company} />;
    }

    render() {
        let companyUuid = this.props.match.params.uuid;
        let company = new Company(this.props.address.objectList[companyUuid]);
        return (
            <div className="UserComAppPage">
                <h1>UserComAppPage Works!</h1>
                {
                    (companyUuid && (companyUuid in this.props.address.objectList)) ?
                    this.renderCompany(companyUuid)
                    :
                    (companyUuid) ?
                    <span>No company found. Uuid={companyUuid}</span>
                    :
                    <span>Company uuid not specified</span>
                }
            </div>
        );
    }
}

const mapStateToProps = (store: IRootState) => ({
    // prop: store.prop
    address: store.address
});

const mapDispatchToProps = {
    // actionName = (newState for that action & its type) => dispatch(ActionCreatorFunction(newState))
};

export const UserComAppPageContainer = withRouter(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(UserComAppPage)
);
