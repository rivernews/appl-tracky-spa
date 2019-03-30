import React, { Component } from "react";
import { withRouter, RouteComponentProps } from "react-router-dom";

/** Redux */
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { IRootState } from "../../store/types";

/** Components */

interface IFormFactoryProps extends RouteComponentProps {
    
}

class FormFactory extends Component<IFormFactoryProps> {
    render() {
        return (
            <div className="FormFactory">
                <h1>FormFactory Works!</h1>
            </div>
        )
    }
}

const mapStateToProps = (store: IRootState) => ({
    // prop: store.prop
});

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
    // actionName: (newState for that action & its type) => dispatch(ActionCreatorFunction(newState))
    return {}
};

export const FormFactoryContainer = withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(FormFactory));
