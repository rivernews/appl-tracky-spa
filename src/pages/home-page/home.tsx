import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { SocialAuth } from "../../components/social-auth/social-auth";
import { LandingPage } from "../landing-page/landing-page";
import { UserHomePage } from "../user-home-page/user-home-page";

class HomePage extends Component<any, any> {
  static propTypes = {
    // prop: PropTypes
  }

  render() {
    return (
      <div>
        <h1>Home Page works!</h1>
        <hr></hr>
        <SocialAuth />
        <hr></hr>
        {/* 
            if logged in, show UserHomePage
            else, show LandingPage
        */}
      </div>
    )
  }
}

export {
    HomePage
}