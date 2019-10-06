/** React core */
import React, { Component, Dispatch } from "react";

/** Redux */
import { AnyAction } from "redux";
import { connect } from "react-redux";
import { IRootState } from "./store/types";
import { RequestedLoginAuth } from "./store/auth/actions";

/** Routes & pages */
import { PageRoutesContainer } from "./pages/page-routes/page-routes";

/** Locals */
import "./App.css";


interface IAppProps {
    retrieveLoginAuth: () => void;
}

class App extends Component<IAppProps> {
    componentDidMount() {
        this.props.retrieveLoginAuth();
    }

    render() {
        return (
            <div className="App">
                <PageRoutesContainer />
            </div>
        );
    }
}

const mapStateToProps = (store: IRootState) => {
    return {
    };
};

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) => { 
    return {
        retrieveLoginAuth: () => {
            dispatch(
                RequestedLoginAuth("")
            );
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
