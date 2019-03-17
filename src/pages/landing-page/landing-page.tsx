import React, { Component } from "react";
import PropTypes from "prop-types";

/** redux */
import { connect } from "react-redux";
import { IRootState } from "../../store/types";
import { IAuthState } from "../../store/auth/types";

/** components */
import SocialAuthButtonContainer from "../../components/social-auth/social-auth-button-container";

let styles = {
    backgroundColor: "purple",
    color: "white"
}

export class LandingPage extends Component<any, any> {
  static propTypes = {
    // prop: PropTypes
  };

  render() {
    return (
      <div className="LandingPage" style={styles}>
        <h1>Landing Page works!</h1>
        <SocialAuthButtonContainer />
      </div>
    );
  }
}

const mapStateToProps = (store: IRootState) => {
  return {
    auth: store.auth
  };
};

export default connect(mapStateToProps)(LandingPage)
