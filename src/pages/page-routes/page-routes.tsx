import React, { Component } from "react";

/** Redux */
import { connect } from "react-redux";
import { IRootState } from "../../state-management/types/root-types";
import { IUpdateAuthState } from "../../state-management/types/auth-types";

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
import {
    TopAppBarFixedAdjust,
} from '@material/react-top-app-bar';

// transition effects
import {
    TransitionGroup,
    CSSTransition
} from "react-transition-group";

// pages
import { LandingPageContainer } from "../landing-page/landing-page";
import { LocalLoginPageContainer } from "../login-page/local-login-page";
import { UserAppPageContainer } from "../../pages/user-app-page/user-app-page";
import { AddComPageContainer } from "../../pages/add-com-page/add-com-page";
import { UserComAppPageContainer } from "../../pages/user-com-app-page/user-com-app-page";
import { UserProfilePageContainer } from "../../pages/user-profile-page/user-profile-page";

import pageTransitionStyles from "./page-routes-transition.module.css";

import LinearProgress from '@material/react-linear-progress';
import '@material/react-linear-progress/dist/linear-progress.css';

import "@material/react-ripple/dist/ripple.css";

import { AppTopBar } from "../../components/app-top-bar/app-top-bar";


const publicPageSet = new Set([
    "/",
    "/local-login/",
    // add more public page routres here
    // ...
]);


interface IPageRoutesRouterParams {
    next?: string;
}


interface IPageRoutesProps extends RouteComponentProps<IPageRoutesRouterParams> {
    auth: IUpdateAuthState;
}


class PageRoutes extends Component<IPageRoutesProps> {
    goInternal = (): string => {
        if (!this.props.location.search) {
            return "/home/";
        }

        const query = new URLSearchParams(this.props.location.search);
        const nextUrl = query.get("next");
        if (!nextUrl) {
            return "";
        }

        return nextUrl;
    }

    isCurrentPublicPage = () => {
        return publicPageSet.has(this.props.location.pathname);
    }

    render() {
        return (
            <div>
                {this.isCurrentPublicPage() ? (
                    <div className="PublicRoutesContainer">
                        {/** direct user to internal page if logged in */
                            this.props.auth.isLogin && <Redirect to={this.goInternal()} />}

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
                            {/** protect private routes, but let people come back the internal page they want to access after they login */
                                !this.props.auth.isLogin && <Redirect to={`/?next=${this.props.location.pathname}`} />}

                            <AppTopBar />

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
                                        classNames={{ ...pageTransitionStyles }}
                                        timeout={500}
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
