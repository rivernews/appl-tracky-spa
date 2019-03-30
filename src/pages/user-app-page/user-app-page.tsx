import React, { Component } from "react";
import { withRouter, RouteComponentProps } from "react-router-dom";

/** Redux */
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { IRootState } from "../../store/types";
import { IObjectAction, IObjectStore } from "../../store/rest-api-redux-factory";
import { CompanyActions, Company } from "../../store/data-model/company";
import { CrudType, RequestStatus } from "../../utils/rest-api";

/** Components */
// mdc react icon
import MaterialIcon from "@material/react-material-icon";
// mdc react button
import "@material/react-button/dist/button.css";
import Button from "@material/react-button";
// objects
import { CompanyComponent } from "../../components/company/company-component";

interface IUserAppPageProps extends RouteComponentProps {
    listCompany: (callback?: Function) => void
    company: IObjectStore<Company>
}

class UserAppPage extends Component<IUserAppPageProps> {

    componentDidMount() {
        this.props.listCompany();
    }

    render() {
        return (
            <div className="UserAppPage">
                <h1>UserAppPage Works!</h1>
                <Button
                    onClick={()=>{ this.props.history.push("/add-com/") }}
                    unelevated
                    icon={<MaterialIcon hasRipple icon="add" />}
                    children="Add Company"
                />
                <br></br>
                {
                    (this.props.company.objectList !== {}) && Object.values(this.props.company.objectList).map((company) => {
                        return <CompanyComponent key={company.uuid} company={company} />
                    })
                }
            </div>
        )
    }
}

const mapStateToProps = (store: IRootState) => ({
    // prop: store.prop
    company: store.company,
});

const mapDispatchToProps = (dispatch: Dispatch<IObjectAction<Company>>) => {
    // actionName = (newState for that action & its type) => dispatch(ActionCreatorFunction(newState))
    return {
        listCompany: (callback?: Function) =>
            dispatch(
                CompanyActions[CrudType.LIST][RequestStatus.TRIGGERED].action(
                    new Company({}),
                    callback
                )
            )
    }
};

export const UserAppPageContainer = withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(UserAppPage));
