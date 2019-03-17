import React, { Component } from 'react'

/** Redux */
import { connect } from 'react-redux'
import { IRootState } from "../../store/types";

/** Routing & Pages */
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
// pages
import UserProfilePage from "../user-profile-page/user-profile-page";

/** MDC React */
import TopAppBar, { TopAppBarFixedAdjust } from "@material/react-top-app-bar";
import "@material/react-top-app-bar/dist/top-app-bar.css";
// import '@material/react-material-icon/dist/material-icon.css';
import MaterialIcon from "@material/react-material-icon";
// style
import "@material/react-ripple/dist/ripple.css";
// import {withRipple} from '@material/react-ripple';

/** Components */

export class InternalPageContainer extends Component {
  render() {
    return (
      <div className="InternalPageContainer">
        <TopAppBar
            title="Appl Tracky"
            actionItems={[
              <Link to="/">
                <MaterialIcon hasRipple key="itemHome" icon="home" />
              </Link>,
              <Link to="/profile/">
                <MaterialIcon hasRipple key="itemProfile" icon="account_circle" />
              </Link>
            ]}
          />
          <TopAppBarFixedAdjust>
            <Route path="/" exact component={UserProfilePage} />
            <Route path="/profile/" component={UserProfilePage} />
            {/** add more page routes here */}
          </TopAppBarFixedAdjust>
      </div>
    )
  }
}

const mapStateToProps = (state: IRootState) => ({
  
})

const mapDispatchToProps = {
  
}

export default connect(mapStateToProps, mapDispatchToProps)(InternalPageContainer)
