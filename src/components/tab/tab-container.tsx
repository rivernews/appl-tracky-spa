import React, { Component } from "react";

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
import { TabNames } from "../../data-model/label";


enum SlideDirection {
    LEFTWARD = "leftward",
    RIGHTWARD = "rightward"
}

interface ITabContainerState {
    activeIndex: number
    tabContentSlideDirection: SlideDirection
}

interface ITabContainerProps {
    render?: () => React.ReactElement<ITabContentProps> | React.ReactElement<ITabContentProps>[]
}

export class TabContainer extends Component<ITabContainerProps, ITabContainerState> {
    state = {
        activeIndex: TabNames.INTERVIEWING, // make interviewing the initial tab to be activated
        tabContentSlideDirection: SlideDirection.RIGHTWARD
    }

    handleActiveIndexUpdate = (activeIndex: number) => {
        this.setState({
            activeIndex,
            tabContentSlideDirection: (activeIndex > this.state.activeIndex) ?
                SlideDirection.LEFTWARD : /** the tab item slides rightward, so content slides leftward */
                SlideDirection.RIGHTWARD /** vice versa */
        });
    }

    render() {
        const tabContents = this.props.render ? (
            this.props.render()
        ) : [];
        const tabContentList = Array.isArray(tabContents) ? tabContents : [tabContents];

        return (
            <div>
                <TabBar
                    className={`${styles.tabBar}`}
                    activeIndex={this.state.activeIndex}
                    handleActiveIndexUpdate={this.handleActiveIndexUpdate}
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
                                classNames={this.state.tabContentSlideDirection === SlideDirection.RIGHTWARD ?
                                    { ...rightSlideStyles } :
                                    { ...leftSlideStyles }}
                                in={this.state.activeIndex === index}
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
        )
    }
}
