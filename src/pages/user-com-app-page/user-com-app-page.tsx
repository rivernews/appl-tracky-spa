import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { RouteComponentProps } from 'react-router';

/** Redux */
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { IRootState } from "../../store/types";

/** Components */

interface IUserComAppPageParams {
    id: string
}

class UserComAppPage extends Component<RouteComponentProps<IUserComAppPageParams>> {
    render() {
        return (
            <div className="UserComAppPage">
                <h1>UserComAppPage Works!</h1>
                <p>
                    Company id is {this.props.match.params.id}
                </p>
            </div>
        )
    }
}

const mapStateToProps = (store: IRootState) => ({
    // prop: store.prop
});

const mapDispatchToProps = {
    // actionName = (newState for that action & its type) => dispatch(ActionCreatorFunction(newState))
};

export const UserComAppPageContainer = withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(UserComAppPage));
