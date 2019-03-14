import React, { Component } from "react";
import PropTypes from "prop-types";

/** redux */
import { connect } from "react-redux";
import { IRootState } from "../../store/types";
import { IAuthState } from "../../store/auth/types";

/** components */
import UserInfo from "../../components/user-info/user-info";

class UserHomePage extends Component<{ auth: IAuthState }, any> {
  static propTypes = {
    // prop: PropTypes
  };

  render() {
    return (
      <div>
        <h1>User Home Page works!</h1>
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

export default connect(mapStateToProps)(UserHomePage);
