import React, { useCallback } from 'react';

import {
    Link,
    useLocation,
    useHistory
} from "react-router-dom";

// font awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGithub } from '@fortawesome/free-brands-svg-icons'


/** MDC React */
import TopAppBar, {
    TopAppBarIcon,
    TopAppBarRow,
    TopAppBarSection,
    TopAppBarTitle,
} from '@material/react-top-app-bar';
import "@material/react-top-app-bar/dist/top-app-bar.css";


import '@material/react-material-icon/dist/material-icon.css';
import MaterialIcon from "@material/react-material-icon";
import { useSelector } from 'react-redux';
import { IRootState } from '../../state-management/types/root-types';

import styles from './app-top-bar.module.css';
import { SelectCompanyMenu } from './select-company-menu';


export const AppTopBar = () => {
    const auth = useSelector((state: IRootState) => state.auth);
    const location = useLocation();
    const history = useHistory();

    const goHome = useCallback(() => {
        location.pathname === '/home/' ? history.replace('/home/') : history.push('/home/');
    }, [history, location.pathname])

    const selectCompanyCollection = useSelector((state: IRootState) => state.selectCompany.selectCompanyCollection);

    return (<>
        <TopAppBar>
            <TopAppBarRow>
                <TopAppBarSection align="start">
                    {/* <TopAppBarIcon>
                        <MaterialIcon icon='menu' />
                    </TopAppBarIcon> */}
                    <TopAppBarTitle className={styles.topAppBarTitle} onClick={goHome}>Appl Tracky</TopAppBarTitle>
                </TopAppBarSection>

                {selectCompanyCollection.size ? (
                    <TopAppBarSection align="start">
                        <SelectCompanyMenu />
                    </TopAppBarSection>
                ) : null}

                <TopAppBarSection align='end' role='toolbar'>
                    <TopAppBarIcon navIcon tabIndex={0}>
                        <Link to="/home/">
                            <MaterialIcon
                                key="itemHome"
                                icon="home"
                            />
                        </Link>
                    </TopAppBarIcon>
                    <TopAppBarIcon navIcon tabIndex={1}>
                        <a target="_blank" href="//github.com/rivernews/appl-tracky-spa">
                            <FontAwesomeIcon icon={faGithub} size="lg" />
                        </a>
                    </TopAppBarIcon>
                    <TopAppBarIcon navIcon tabIndex={2}>
                        <Link to="/profile/">
                            {!auth.avatarUrl ? (
                                <MaterialIcon
                                    key="itemProfile"
                                    icon="account_circle"
                                />
                            ) : (
                                    <img style={{
                                        "height": "100%",
                                        "borderRadius": "50%",
                                    }} src={auth.avatarUrl} alt="user avatar" />
                                )}
                        </Link>
                    </TopAppBarIcon>
                </TopAppBarSection>
            </TopAppBarRow>
        </TopAppBar>
    </>)
}