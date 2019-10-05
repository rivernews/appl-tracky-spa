import React, { Component } from "react";
import { withRouter, RouteComponentProps } from "react-router-dom";

/** Redux */
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { IRootState } from "../../store/types";
import { IObjectAction, IObjectStore } from "../../store/rest-api-redux-factory";
// data models
import { Company } from "../../store/data-model/company";
import { Application } from "../../store/data-model/application";

/** Components */
// mdc react icon
import MaterialIcon from "@material/react-material-icon";
// mdc react button
import "@material/react-button/dist/button.css";
import Button from "@material/react-button";
// objects
import { CompanyApplicationComponentContainer } from "../../components/company-application/company-application-component";

interface IUserAppPageProps extends RouteComponentProps {
    company: IObjectStore<Company>
    application: IObjectStore<Application>
}

class UserAppPage extends Component<IUserAppPageProps> {

    componentDidMount() {
    }

    render() {
        return (
            <div className="UserAppPage">
                <h1>Companies You Apply</h1>
                <Button
                    onClick={()=>{ this.props.history.push("/com-form/") }}
                    unelevated
                    icon={<MaterialIcon hasRipple icon="add" />}
                    children="Add Company"
                />
                <br></br>
                {
                    (this.props.company.collection !== {}) && Object.values(this.props.company.collection).map((company) => {
                        return (
                            <CompanyApplicationComponentContainer key={company.uuid} company={company} />
                        )
                    })
                }
            </div>
        )
    }
}

const mapStateToProps = (store: IRootState) => ({
    // prop: store.prop
    company: store.company,
    application: store.application,
});

const mapDispatchToProps = (dispatch: Dispatch<IObjectAction<{}>>) => {
    // actionName = (newState for that action & its type) => dispatch(ActionCreatorFunction(newState))

    return {
        // listObject: (callback?: Function) =>
        //     dispatch(
        //         ObjectActions[CrudType.LIST][RequestStatus.TRIGGERED].action(
        //             new Object({}),
        //             callback
        //         )
        //     ),
    }
};

export const UserAppPageContainer = withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(UserAppPage));
