import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";

import { SocialAuth } from "./components/social-auth/social-auth";

class App extends Component {
  state = {
    apiBaseUrl: `http://localhost:8000/`,
    addresses: []
  };

  componentDidMount() {}

  render() {
    return (
      <div className="App">
        <SocialAuth />

      </div>
    );
  }
}

export default App;
