import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { RouteComponentProps } from 'react-router';

/** Redux */
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { IRootState } from "../../store/types";
// rest api
import { IObjectStore } from "../../store/rest-api-redux-factory";
import { Address } from "../../store/data-model/address";

/** Components */

interface IUserComAppPageParams {
    uuid: string
}

interface IUserComAppPageProps extends RouteComponentProps<IUserComAppPageParams> {
    address: IObjectStore<Address>
}

class UserComAppPage extends Component<IUserComAppPageProps> {
    render() {
        let uuid = this.props.match.params.uuid;
        let address = this.props.address.objectList[uuid];
        return (
            <div className="UserComAppPage">
                <h1>UserComAppPage Works!</h1>
                <p>
                    Address uuid is {uuid}
                </p>
                <ul>
                    <li>Full address: {address.full_address}</li>
                </ul>
            </div>
        )
    }
}

const mapStateToProps = (store: IRootState) => ({
    // prop: store.prop
    address: store.address
});

const mapDispatchToProps = {
    // actionName = (newState for that action & its type) => dispatch(ActionCreatorFunction(newState))
};

export const UserComAppPageContainer = withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(UserComAppPage));
