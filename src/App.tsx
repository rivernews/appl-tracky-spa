/** React core */
import React, { Component } from "react";

/** Redux */
import { connect } from "react-redux";
import { IRootState } from "./store/types";

/** Routes & pages */
import { PageRoutesContainer } from "./pages/page-routes/page-routes";

/** Locals */
import "./App.css";

interface IAppProps {}

class App extends Component<IAppProps> {
    componentDidMount() {}

    render() {
        return (
            <div className="App">
                <PageRoutesContainer />
            </div>
        );
    }
}

const mapStateToProps = (store: IRootState) => {
    return {};
};

export default connect(mapStateToProps)(App);
