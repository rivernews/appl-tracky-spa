import React, { Component } from "react";
import { withRouter, RouteComponentProps } from "react-router-dom";

/** Redux */
import { connect } from "react-redux";
import { Dispatch, AnyAction } from "redux";
import { IRootState } from "../../state-management/types/root-types";
import { IUpdateAuthState } from "../../state-management/types/auth-types";

/** Components */
import { SocialAuthButtonContainer } from "../../components/login/social-auth-button";
import MaterialIcon from "@material/react-material-icon";
// mdc react button
import "@material/react-button/dist/button.css";
import Button from "@material/react-button";

import {
    Body1,
    Body2,
    // Button,
    Caption,
    Headline1,
    Headline2,
    Headline3,
    Headline4,
    Headline5,
    Headline6,
    Overline,
    Subtitle1,
    Subtitle2,
} from '@material/react-typography';
import '@material/react-typography/dist/typography.css';

import styles from './landing-page.module.css';


interface ILandingPageProps extends RouteComponentProps {
    auth: IUpdateAuthState;
}


class LandingPage extends Component<ILandingPageProps> {
    formFactoryProps: any;

    constructor(props: ILandingPageProps) {
        super(props);
    }

    onStaffLoginClick = () => {
        this.props.history.push("/local-login/");
    }

    render() {
        return (
            <div className={styles.LandingPage} >
                <div className={styles.primaryPageContent}>
                    <div className={styles.headlineContent}>
                        <Headline1 className={styles.headlineText}>Appl Tracky</Headline1>
                        <Headline4 className={styles.headlineSubText}>Got crazy using speadsheet to keep track of your application progress? Try out Appl Tracky to ease your workflow!</Headline4>
                        <Body1>
                            Whether it is application for job, school program, scholarship or whatever process that lets you wait from a couple weeks to months, Appl Tracky has you covered. Keep track of every steps in the process, insert links, put down notes to get you more organized and prepared!
                        </Body1>
                    </div>

                    <div className={styles.loginActionsContainer}>
                        <Headline4>Sign up & login now to get organized</Headline4>
                        <SocialAuthButtonContainer />
                        <Body1>
                            Just want to try things out and don't want to sign up yet? No problem, here's a guest account you can use:
                        </Body1>
                        <div>🦄 username: guest</div>
                        <div>🦄 password: appltracky</div>
                        <Button
                            onClick={this.onStaffLoginClick}
                            unelevated
                            icon={
                                <MaterialIcon hasRipple icon="account_circle" />
                            }
                        >
                            Sign in
                    </Button>
                    </div>

                    <div className={styles.divider} />

                    <div className={styles.sideNoteContent}>
                        <Subtitle1>
                            Take a look at the React code that fuels and powers all the goodies!
                        </Subtitle1>
                        <Button
                            href="https://github.com/rivernews/appl-tracky-spa"
                            target="_blank"
                            unelevated
                            icon={
                                <MaterialIcon hasRipple icon="code" />
                            }
                        >
                            Github Repository
                </Button>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state: IRootState) => ({
    auth: state.auth
});

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) => {
    // actionName = (newState for that action & its type) => dispatch(ActionCreatorFunction(newState))
    return {
    };
};

export const LandingPageContainer = withRouter(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(LandingPage)
);
