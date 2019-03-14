import React, { Component } from "react";
import PropTypes from "prop-types";

/** redux */
import { connect } from "react-redux";
import { IRootState } from "../../store/types";
import { IAuthState } from "../../store/auth/types";

import LandingPage from "../landing-page/landing-page";
import UserHomePage from "../user-home-page/user-home-page";

class HomePage extends Component<{ auth: IAuthState }, any> {
  static propTypes = {
    //
  };

  render() {
    console.log("check auth", this.props.auth);
    return (
      <div>
        <h1>Home Page works!</h1>
        <hr />
        {/* 
            if logged in, show UserHomePage
            else, show LandingPage
        */}
        {
            (this.props.auth.isLogin) ? <UserHomePage /> : <LandingPage />
        }
      </div>
    );
  }
}

const mapStateToProps = (store: IRootState) => {
  return {
    auth: store.auth
  };
};

export default connect(mapStateToProps)(HomePage);
