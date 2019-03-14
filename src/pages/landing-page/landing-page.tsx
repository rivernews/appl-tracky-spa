import React, { Component } from "react";
import PropTypes from "prop-types";

/** redux */
import { connect } from "react-redux";
import { IRootState } from "../../store/types";
import { IAuthState } from "../../store/auth/types";

/** components */
import { SocialAuth } from "../../components/social-auth/social-auth";
import UserInfo from "../../components/user-info/user-info";

class LandingPage extends Component<any, any> {
  static propTypes = {
    // prop: PropTypes
  };

  render() {
    return (
      <div>
        <h1>Landing Page works!</h1>
        <SocialAuth />
        <hr></hr>
        <UserInfo auth={this.props.auth} />
      </div>
    );
  }
}

const mapStateToProps = (store: IRootState) => {
  return {
    auth: store.auth
  };
};

export default connect(mapStateToProps)(LandingPage);
