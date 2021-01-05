import React, { Component } from "react";

import styles from "./tab-content.module.css";


export interface ITabContentProps {
    label: string | JSX.Element
}

export class TabContent extends Component<ITabContentProps> {
    render() {
        return (
            <div className={styles.TabContent}>
                {this.props.children}
            </div>
        )
    }
}
