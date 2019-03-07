import React, { Component } from "react";
import PropTypes from "prop-types";

import { GoogleLogin } from "react-google-login";
import { GoogleLogout } from "react-google-login";

class SocialAuth extends Component {
  static propTypes = {
    // prop: PropTypes
  };

  state = {
    clientID: `732988498848-vuhd6g61bnlqe372i3l5pbpnerteu6na.apps.googleusercontent.com`,
    code: ``,
    redirectUri: `postmessage`,
    apiBaseUrl: `http://localhost:8000/`,
    apiLoginUrl: `login/social/`,
    socialAuthProvider: `google-oauth2`,

    userEmail: ``,
    apiLoginToken: ``,
    userFirstName: ``,
    userLastName: ``,

    objectID: ``,
  };

  onSocialLoginSuccess = (googleOauthResponse: any) => {
    console.log("Google Oauth2 res:", googleOauthResponse);
    this.setState(
      {
        code: googleOauthResponse.code
      },
      () => {
        this.apiLogin();
      }
    );
  };

  onSocialLoginFailure = (error: any) => {
    console.error("Social login failed:", error);
  };

  onSocialLogoutSuccess = () => {
    console.log("Logout success");
    this.setState({
      code: ``,
      userEmail: ``,
      apiLoginToken: ``,
      userFirstName: ``,
      userLastName: ``
    });
  };

  apiLogin = () => {
    this.apiPost({
      data: {
        code: this.state.code,
        provider: this.state.socialAuthProvider,
        redirect_uri: this.state.redirectUri
      },
      endpointUrl: this.state.apiLoginUrl
    })
      .then(jsonData => {
        console.log("API login res:", JSON.stringify(jsonData));
        if (jsonData.email) {
          console.log("API login success.");
          this.setState({
            userEmail: jsonData.email,
            userFirstName: jsonData.first_name,
            userLastName: jsonData.last_name,
            apiLoginToken: jsonData.token
          });
        } else {
          console.warn("API login failure.");
        }
      })
      .catch(error => {
        console.error("API login error:", error);
      });
  };

  apiPost = ({ data, endpointUrl }: { data: object; endpointUrl: string }) => {
    return fetch(`${this.state.apiBaseUrl}${endpointUrl}`, {
      method: "POST",
      ...this.setApiLoginHeaders(),
      body: JSON.stringify(data)
    }).then(res => res.json());
    // let caller handle error in their own .catch()
  };

  apiGet = ({ endpointUrl }: { endpointUrl: string }) => {
    return fetch(`${this.state.apiBaseUrl}${endpointUrl}`, {
      method: "GET",
      ...this.setApiLoginHeaders()
    }).then(res => res.json());
  };

  apiDelete = ({ modelEndpointUrl, objectID }: { modelEndpointUrl: string; objectID: string }) => {
    return fetch(`${this.state.apiBaseUrl}${modelEndpointUrl}${objectID}/`, {
        method: "DELETE",
        ...this.setApiLoginHeaders(),
      });
      // delete does not respond anything
  }

  setApiLoginHeaders = (): RequestInit => {
    return {
      mode: "cors",
      credentials: (this.state.apiLoginToken) ? "include" : "omit",
      headers: {
        Authorization: (this.state.apiLoginToken) ? `JWT ${this.state.apiLoginToken}` : ``,
        "Content-Type": "application/json"
      }
    };
  };

  testReadPrivateData = () => {
    this.apiGet({ endpointUrl: "addresses/" })
      .then(jsonData => {
        console.log("Test res:", jsonData);
      })
      .catch(error => {
        console.error("Test fail:", error);
      });
  };

  testCreatePrivateData = () => {
    this.apiPost({
      data: {
        place_name: "my react created address!"
      },
      endpointUrl: "addresses/"
    })
      .then(jsonData => {
        console.log("Test res:", jsonData);
      })
      .catch(error => {
        console.error("Test fail:", error);
      });
  };

  testDeletePrivateData = () => {
    this.apiDelete({
        modelEndpointUrl: "addresses/",
        objectID: this.state.objectID,
    })
    .then(jsonData => {
        console.log("Test res:", jsonData);
    })
    .catch(error => {
        console.error("Test fail:", error);
    });
  }

  render() {
    return (
      <div className="SocialAuth">
        <h1>Social Auth</h1>
        <h2>Your current client ID:</h2>
        <p>{this.state.clientID}</p>

        <h2>Current code:</h2>
        <p>{this.state.code || "(empty)"}</p>
        <GoogleLogin
          clientId={this.state.clientID}
          buttonText="Login"
          onSuccess={this.onSocialLoginSuccess}
          onFailure={this.onSocialLoginFailure}
          responseType="code"
          isSignedIn={false}
          redirectUri={this.state.redirectUri}
        />
        <GoogleLogout
          buttonText="Logout"
          onLogoutSuccess={this.onSocialLogoutSuccess}
        />
        <h2>User Information</h2>
        {this.state.userEmail ? (
          <div className="UserInfo">
            <p>
              Email: {this.state.userEmail} <br />
              First Name: {this.state.userFirstName} <br />
              Last Name: {this.state.userLastName} <br />
              API Login Token: {this.state.apiLoginToken}
            </p>
            <p>
                ObjectID: <input onChange={(event) => { this.setState({ objectID: event.target.value }) }}  /><br></br>
                ObjectID is now {this.state.objectID}
            </p>
            <p>
              <button onClick={this.testReadPrivateData}>
                Test Read Private Data
              </button>
            </p>
            <p>
              <button onClick={this.testCreatePrivateData}>
                Test Create Private Data
              </button>
            </p>
            <p>
              <button onClick={this.testDeletePrivateData}>
                Test Delete Private Data
              </button>
            </p>
          </div>
        ) : (
          <p>(empty)</p>
        )}
      </div>
    );
  }
}

export { SocialAuth };
