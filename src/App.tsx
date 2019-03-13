// core
import React, { Component } from "react";

// mdc-react
import TopAppBar, { TopAppBarFixedAdjust } from "@material/react-top-app-bar";
import "@material/react-top-app-bar/dist/top-app-bar.css";

// import '@material/react-material-icon/dist/material-icon.css';
import MaterialIcon from "@material/react-material-icon";

import "@material/react-ripple/dist/ripple.css";
// import {withRipple} from '@material/react-ripple';

// ours
import { AppState } from "./store/app-store";
import { AuthStateType } from "./store/auth/types";
import { updateAuthAction } from "./store/auth/actions";
import logo from "./logo.svg";
import "./App.css";

// routing & pages
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { HomePage } from "./pages/home-page/home";
import { UserProfilePage } from "./pages/user-profile-page/user-profile";

const mapStateToProps = (state: AppState) => ({
    auth: state.auth
})

interface AppPropsType {
    // action creator type
    udpateAuthAction: typeof updateAuthAction

    // store (state) type
    auth: AuthStateType
}

class App extends Component<AppPropsType> {

  componentDidMount() {

  }

  render() {
    return (
      <Router>
        <div className="App">
          <TopAppBar
            title="Appl Tracky"
            navigationIcon={
              <MaterialIcon
                hasRipple
                icon="menu"
                onClick={() => console.log("click")}
              />
            }
            actionItems={[
              <Link to="/">
                <MaterialIcon hasRipple key="item" icon="home" />
              </Link>,
              <Link to="/profile/">
                <MaterialIcon hasRipple key="item" icon="account_circle" />
              </Link>
            ]}
          />
          <TopAppBarFixedAdjust>
            <Route path="/" exact component={HomePage} />
            <Route path="/profile/" component={UserProfilePage} />
          </TopAppBarFixedAdjust>
        </div>
      </Router>
    );
  }
}

export default App;
