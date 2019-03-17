/** React core */
import React, { Component } from "react";

/** Redux */
import { connect } from "react-redux";
import { IRootState } from "./store/types";
import { IAuthState } from "./store/auth/types";

/** Routes & pages */
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { InternalPageContainer } from "./pages/internal-page/internal-page-container";
import { LandingPage } from "./pages/landing-page/landing-page";

/** Locals */
import "./App.css";

interface IAppProps {
    auth: IAuthState
}

class App extends Component<IAppProps> {
  componentDidMount() {}

  render() {
    return (
      <Router>
        <div className="App">
        {
            (!this.props.auth.isLogin) ? 
            <LandingPage />
            : 
            <InternalPageContainer /> 
        }
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
