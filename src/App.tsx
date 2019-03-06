import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";

import { GoogleLogin } from "react-google-login";
import { GoogleLogout } from "react-google-login";

class App extends Component {
  state = {
    clientID: `732988498848-vuhd6g61bnlqe372i3l5pbpnerteu6na.apps.googleusercontent.com`,
    code: ``,
    jwtUrl: `http://localhost:8000/api/login/social/jwt_user/`,
    apiBaseUrl: `http://localhost:8000/`,
    redirectUri: `postmessage`,
  };

  componentDidMount() {}

  responseGoogle = (res: any) => {
    console.log("social provider res is", res);
    this.setState({
      code: res.code
    });
  };

  onClickRequestServerJWT = () => {
    console.log(`Ready to request our backend server...`);
    this.requestServerJWT({
      code: this.state.code,
    });
  };

  requestServerJWT({ code = "" }: { code?: string; redirect_uri?: string }) {
    // destructuring in typescript: https://mariusschulz.com/blog/typing-destructured-object-parameters-in-typescript
    this.postRequest(this.state.jwtUrl, {
      code,
      provider: "google-oauth2",
      redirect_uri: this.state.redirectUri,
    }).then(res => {
      console.log("our server res is", res);
    })
    .catch((err) => {
        console.error("Gor error when requesting server:", err);
    });
  }

  logout = () => {
    console.log("logged out.");
    this.setState({
        code: ``
    })
  };

  async postRequest(url: string, data: any = {}) {
    // Fetch API: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
    console.log(`hitting our server (POST) with data:`, data);
    try {
      let res = await fetch(url, {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data) // must match content type in header
      });
      return res.json();
    } catch (err) {
      console.error("postRequest error:", err);
    }
  }

  render() {
    // fetch("https://appl-tracky-api-https.shaungc.com/", {mode: 'cors'})
    // .then((res) => {
    //     return res.text();
    // })
    // .catch((err) => {
    //     console.error(err);
    // })
    // .then((text) => {
    //     console.info(text);
    // });

    return (
      <div className="App">
        <h1>Your current client ID:</h1>
        <p>
          <input
            value={this.state.clientID}
            onChange={event => this.setState({ clientID: event.target.value })}
          />
        </p>

        <h1>Current code:</h1>
        <p>{this.state.code || "(empty)"}</p>
        <GoogleLogin
          clientId={this.state.clientID}
          buttonText="Login"
          onSuccess={this.responseGoogle}
          onFailure={this.responseGoogle}
          responseType="code"
          isSignedIn={false}
          redirectUri={this.state.redirectUri}
        />
        <button onClick={this.onClickRequestServerJWT}>Ask Server JWT</button>
        <GoogleLogout
          buttonText="Logout"
          onLogoutSuccess={this.logout}
        />
      </div>
    );
  }
}

export default App;
