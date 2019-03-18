import React, { Component } from "react";
import { withRouter, RouteComponentProps } from "react-router-dom";

/** Redux */
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { IRootState } from "../../store/types";

/** Components */
// mdc react button
import "@material/react-button/dist/button.css";
import Button from "@material/react-button";


interface IAddComPageProps extends RouteComponentProps {
    
}

class AddComPage extends Component<IAddComPageProps> {
    render() {
        return (
            <div className="AddComPage">
                <h1>AddComPage Works!</h1>
                <Button
                    onClick={()=>{ this.props.history.push("/com-app/erwrwr-123421-adfdf/") }}
                    unelevated
                    children="Create"
                />
            </div>
        )
    }
}

const mapStateToProps = (state: IRootState) => ({
    // prop: state.prop
});

const mapDispatchToProps = {
    // actionName = (newState for that action & its type) => dispatch(ActionCreatorFunction(newState))
};

export const AddComPageContainer = withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(AddComPage));
