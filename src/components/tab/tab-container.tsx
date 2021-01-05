import React, { useState } from "react";

/** Components */
// react-mdc tab
import '@material/react-tab-bar/dist/tab-bar.css';
import '@material/react-tab-scroller/dist/tab-scroller.css';
import '@material/react-tab/dist/tab.css';
import '@material/react-tab-indicator/dist/tab-indicator.css';
import Tab from '@material/react-tab';
import TabBar from '@material/react-tab-bar';

import { TabContent, ITabContentProps } from "./tab-content";

import { CSSTransition } from 'react-transition-group';

import leftSlideStyles from './tab-transition-slide-left.module.css';
import rightSlideStyles from './tab-transition-slide-right.module.css';
import styles from './tab-container.module.css';
import { useDispatch, useSelector } from "react-redux";
import { SetActiveTabOfUserAppPage } from "../../state-management/action-creators/user-app-page-actions";
import { IRootState } from "../../state-management/types/root-types";


enum SlideDirection {
    LEFTWARD = "leftward",
    RIGHTWARD = "rightward"
}

interface ITabContainerProps {
    render?: () => React.ReactElement<ITabContentProps> | React.ReactElement<ITabContentProps>[]
}

export const TabContainer = ({ render }: ITabContainerProps) => {
    const dispatch = useDispatch();
    const activeIndex = useSelector((state: IRootState) => state.userAppPage.activeTabIndex);
    const [tabContentSlideDirection, setTabContentSlideDirection] = useState<SlideDirection>(SlideDirection.RIGHTWARD);

    const handleActiveIndexUpdate = (newActiveIndex: number) => {
        dispatch(SetActiveTabOfUserAppPage(newActiveIndex));
        setTabContentSlideDirection(
            (newActiveIndex > activeIndex) ?
                SlideDirection.LEFTWARD : /** the tab item slides rightward, so content slides leftward */
                SlideDirection.RIGHTWARD /** vice versa */
        );
    }


    const tabContents = render ? (
        render()
    ) : [];
    const tabContentList = Array.isArray(tabContents) ? tabContents : [tabContents];

    return (
        <div>
            <TabBar
                className={`${styles.tabBar}`}
                activeIndex={activeIndex}
                handleActiveIndexUpdate={handleActiveIndexUpdate}
            >
                {
                    tabContentList.map((tabContent, index) => (
                        <Tab key={index} tabIndex={index}>
                            <span className='mdc-tab__text-label'>{tabContent.props.label}</span>
                        </Tab>
                    ))
                }
            </TabBar>
            {
                tabContentList.map((child, index) => {
                    return (
                        <CSSTransition
                            key={index}
                            classNames={tabContentSlideDirection === SlideDirection.RIGHTWARD ?
                                { ...rightSlideStyles } :
                                { ...leftSlideStyles }}
                            in={activeIndex === index}
                            timeout={500}
                            unmountOnExit
                        >
                            <TabContent
                                {...child.props}
                            />
                        </CSSTransition>
                    );
                })
            }
        </div>
    );
}
