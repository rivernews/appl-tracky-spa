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
                {this.props.location.pathname === "/" ? (
                    <Route path="/" exact component={LandingPageContainer} />
                ) : (
                    <div className="PrivateRoutesContainer">

                        {
                            /** protect private routes */
                            (!this.props.auth.isLogin) && (
                                <Redirect to="/" />
                            )
                        }

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
                                    <MaterialIcon
                                        hasRipple
                                        key="itemProfile"
                                        icon="account_circle"
                                    />
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
                                    path="/add-com/"
                                    component={AddComPageContainer}
                                />
                                <Route
                                    path="/com-app/:uuid/"
                                    component={UserComAppPageContainer}
                                />
                                <Route
                                    path="/profile/"
                                    component={UserProfilePageContainer}
                                />
                                {/** add more page routes here */}
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
