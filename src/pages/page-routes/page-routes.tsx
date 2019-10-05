import React, { Component } from "react";

/** Redux */
import { connect } from "react-redux";
import { IRootState } from "../../store/types";
import { IUpdateAuthState } from "../../store/auth/types";

/** Routing & Pages */
import {
    Route,
    Redirect,
    Switch,
    Link,
    withRouter,
    RouteComponentProps
} from "react-router-dom";
// pages
import { LandingPageContainer } from "../landing-page/landing-page";
import { LocalLoginPageContainer } from "../login-page/local-login-page";
import { UserAppPageContainer } from "../user-app-page/user-app-page";
import { AddComPageContainer } from "../add-com-page/add-com-page";
import { UserComAppPageContainer } from "../user-com-app-page/user-com-app-page";
import { UserProfilePageContainer } from "../user-profile-page/user-profile-page";

/** MDC React */
import TopAppBar, { TopAppBarFixedAdjust } from "@material/react-top-app-bar";
import "@material/react-top-app-bar/dist/top-app-bar.css";
// import '@material/react-material-icon/dist/material-icon.css';
import MaterialIcon from "@material/react-material-icon";
// style
import "@material/react-ripple/dist/ripple.css";

// import {withRipple} from '@material/react-ripple';

interface IPageRoutesProps extends RouteComponentProps {
    auth: IUpdateAuthState;
}

class PageRoutes extends Component<IPageRoutesProps> {
    render() {
        return (
            <div className="PageRoutesContainer">
                {(
                    this.props.location.pathname === "/" ||
                    this.props.location.pathname === "/local-login/"
                    // add more public page routres here
                    // ...
                ) ? (
                        <div className="PublicRoutesContainer">
                            {/** direct user to home pagae (internal) if logged in */
                                this.props.auth.isLogin && <Redirect to="/home/" />}
                            <Switch>
                                <Route path="/" exact component={LandingPageContainer} />
                                <Route path="/local-login/" exact component={LocalLoginPageContainer} />
                                {
                                    /** add more public page routes here */
                                    // ...
                                }
                            </Switch>
                        </div>
                    ) : (
                        <div className="PrivateRoutesContainer">
                            {/** protect private routes */
                                !this.props.auth.isLogin && <Redirect to="/" />}

                            <TopAppBar
                                title="Appl Tracky"
                                actionItems={[
                                    <Link to="/home/">
                                        <MaterialIcon
                                            hasRipple
                                            key="itemHome"
                                            icon="home"
                                        />
                                    </Link>,

                                    <Link to="/profile/">
                                        {this.props.auth.avatarUrl === "" ? (
                                            <MaterialIcon
                                                hasRipple
                                                key="itemProfile"
                                                icon="account_circle"
                                            />
                                        ) : (
                                                <img style={{
                                                    "height": "100%",
                                                    "borderRadius": "50%",
                                                }} src={this.props.auth.avatarUrl} />
                                            )}
                                    </Link>
                                ]}
                            />
                            <TopAppBarFixedAdjust>
                                <Switch>
                                    <Route
                                        path="/home/"
                                        component={UserAppPageContainer}
                                    />
                                    <Route
                                        path="/com-form/:uuid?/"
                                        component={AddComPageContainer}
                                    />
                                    <Route
                                        path="/com-app/:uuid/"
                                        component={UserComAppPageContainer}
                                    />
                                    <Route
                                        path="/com-app/"
                                        component={UserComAppPageContainer}
                                    />
                                    <Route
                                        path="/profile/"
                                        component={UserProfilePageContainer}
                                    />
                                    {/** add more private page routes here */}
                                </Switch>
                            </TopAppBarFixedAdjust>
                        </div>
                    )}
            </div>
        );
    }
}

const mapStateToProps = (store: IRootState) => ({
    auth: store.auth
});

const mapDispatchToProps = {};

export const PageRoutesContainer = withRouter(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(PageRoutes)
);
