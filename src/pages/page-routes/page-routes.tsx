import React, { Component } from "react";

/** Redux */
import { connect } from "react-redux";
import { IRootState } from "../../store/types";
import { IUpdateAuthState } from "../../store/auth/types";

import { RequestStatus } from "../../utils/rest-api";

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
// transition effects
import {
    TransitionGroup,
    CSSTransition
} from "react-transition-group";

/** MDC React */
import TopAppBar, {
    TopAppBarFixedAdjust,
    TopAppBarIcon,
    TopAppBarRow,
    TopAppBarSection,
    TopAppBarTitle,
} from '@material/react-top-app-bar';
import "@material/react-top-app-bar/dist/top-app-bar.css";

import LinearProgress from '@material/react-linear-progress';
import '@material/react-linear-progress/dist/linear-progress.css';

import '@material/react-material-icon/dist/material-icon.css';
import MaterialIcon from "@material/react-material-icon";

import "@material/react-ripple/dist/ripple.css";
// import {withRipple} from '@material/react-ripple';

import "./page-routes.css";
import styles from "./page-routes.module.css";

interface IPageRoutesProps extends RouteComponentProps {
    auth: IUpdateAuthState;
}

class PageRoutes extends Component<IPageRoutesProps> {
    goHome = () => {
        this.props.location.pathname === '/home/' ? this.props.history.replace('/home/') : this.props.history.push('/home/');
    }

    render() {
        return (
            <div className={`PageRoutesContainer`}>
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

                            {/* <TopAppBar

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
                                        {!this.props.auth.avatarUrl ? (
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
                            /> */}
                            <TopAppBar>
                                <TopAppBarRow>
                                    <TopAppBarSection align="start">
                                        {/* <TopAppBarIcon>
                                            <MaterialIcon hasRipple icon='menu' />
                                        </TopAppBarIcon> */}
                                        <TopAppBarTitle className={styles.topAppBarTitle} onClick={this.goHome}>Appl Tracky</TopAppBarTitle>
                                    </TopAppBarSection>
                                    <TopAppBarSection align='end' role='toolbar'>
                                        <TopAppBarIcon navIcon tabIndex={0}>
                                            <Link to="/home/">
                                                <MaterialIcon
                                                    hasRipple
                                                    key="itemHome"
                                                    icon="home"
                                                />
                                            </Link>
                                        </TopAppBarIcon>
                                        <TopAppBarIcon navIcon tabIndex={1}>
                                            <Link to="/profile/">
                                                {!this.props.auth.avatarUrl ? (
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
                                        </TopAppBarIcon>
                                    </TopAppBarSection>
                                </TopAppBarRow>
                            </TopAppBar>

                            <TopAppBarFixedAdjust>

                                <LinearProgress
                                    indeterminate={this.props.auth.requestStatus === RequestStatus.REQUESTING}

                                    // mdc's progress bar bug workaround
                                    // when press back button, avoid showing dotted buffer animation
                                    buffer={1}
                                    bufferingDots={true}
                                />

                                <TransitionGroup>
                                    <CSSTransition
                                        key={this.props.location.key}
                                        classNames="page"
                                        timeout={400}
                                    >
                                        <Switch location={this.props.location}>
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
                                    </CSSTransition>
                                </TransitionGroup>
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
