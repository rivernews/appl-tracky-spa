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
import { SocialAuth } from "./components/social-auth/social-auth";
import logo from "./logo.svg";
import "./App.css";

class App extends Component {
  state = {
    apiBaseUrl: `http://localhost:8000/`,
    addresses: []
  };

  componentDidMount() {}

  render() {
    return (
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
          actionItems={[<MaterialIcon hasRipple key="item" icon="bookmark" />]}
        />
        <TopAppBarFixedAdjust>
          My exciting content!
          <SocialAuth />
        </TopAppBarFixedAdjust>
      </div>
    );
  }
}

export default App;
