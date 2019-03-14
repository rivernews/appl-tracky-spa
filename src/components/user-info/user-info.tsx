import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { IAuthState } from "../../store/auth/types";

interface UserInfoProps {
    auth: IAuthState
}

export default class UserInfo extends Component<UserInfoProps, any> {

  render() {
    return (
      <div>
        <h1>User Info</h1>
        <div>Logged in: {this.props.auth.isLogin.toString()}</div>
        <div>User Name: {this.props.auth.userName || "(empty)"}</div>
        <div>Token (for API): {this.props.auth.token || "(empty)"}</div>
      </div>
    )
  }
}
