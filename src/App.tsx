/** React core */
import React, { Component } from "react";

/** Redux */
import { connect } from "react-redux";
import { IRootState } from "./store/types";
import { IAuthState } from "./store/auth/types";

/** Routes & pages */
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { PageRoutesContainer } from "./pages/page-routes/page-routes";

/** Locals */
import "./App.css";

interface IAppProps {
    auth: IAuthState;
}

class App extends Component<IAppProps> {
    componentDidMount() {}

    render() {
        console.log("login is", this.props.auth.isLogin);
        return (
            <Router>
                <div className="App">
                    <PageRoutesContainer />
                </div>
            </Router>
        );
    }
}

const mapStateToProps = (store: IRootState) => {
    return {
        auth: store.auth
    };
};

export default connect(mapStateToProps)(App);
