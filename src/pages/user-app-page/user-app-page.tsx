import React, { Component } from "react";
import { withRouter, RouteComponentProps } from "react-router-dom";

/** Redux */
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { IRootState } from "../../store/types";

/** Components */
// mdc react icon
import MaterialIcon from "@material/react-material-icon";
// mdc react button
import "@material/react-button/dist/button.css";
import Button from "@material/react-button";


interface IUserAppPageProps extends RouteComponentProps {
    
}

class UserAppPage extends Component<IUserAppPageProps> {
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
                <Button
                    onClick={()=>{ this.props.history.push("/com-app/erwrwr-123421-adfdf/") }}
                    unelevated
                    icon={<MaterialIcon hasRipple icon="account_circle" />}
                    children="Walmart Lab"
                />
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

export const UserAppPageContainer = withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(UserAppPage));
