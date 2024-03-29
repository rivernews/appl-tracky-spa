import React from "react";

/** Redux & data models */
import { Company } from "../../data-model/company/company";
import { Application } from "../../data-model/application/application";

/** Components */
import '@material/react-card/dist/card.css';
import List, { ListItem, ListItemText } from "@material/react-list";
import MaterialUIListItem from "@material-ui/core/ListItem";
import MaterialUIBox from "@material-ui/core/Box";
import MaterialUIButton from "@material-ui/core/Button";

import '@material/react-list/dist/list.css';
// mdc-chips
import { ChipSet, Chip } from '@material/react-chips';
import "@material/react-chips/dist/chips.css";

import Skeleton from 'react-loading-skeleton';

import styles from './company-list-item.module.css';
import { Typography } from "@material-ui/core";
import CompanyListItemCheckBox from "./company-list-item-checkbox";
import { Link } from "react-router-dom";


interface ICompanyListItemProps {
    company?: Company;
    applications?: Array<Application>
}

const CompanyListItem = (props: ICompanyListItemProps) => {
    return (
        <MaterialUIListItem className={false ? styles.companyCard : ''} dense>
            <MaterialUIBox display="flex" flexWrap="wrap">
                <Link to={`/com-app/${props?.company?.uuid}`}>
                    <MaterialUIButton>
                        <Typography variant="h5">
                            {props.company ? props.company.name : <Skeleton duration={1.1} width={`50vmin`} />}
                        </Typography>
                    </MaterialUIButton>
                </Link>

                {props.company ? (
                    props.company.labels.length && props.company.labels[0].text ? (
                        <ChipSet>
                            <Chip label={props.company.labels[0].text} />
                        </ChipSet>
                    ) : (
                        <ChipSet>
                            <Chip label="None" />
                        </ChipSet>
                    )
                ) : (
                    <Skeleton width="40px" />
                )}

                {
                    props.applications ? (
                        <MaterialUIBox display="flex" flexWrap="wrap">
                            {props.applications.map((application: Application) => (
                                <ListItem key={application.uuid}>
                                    <ListItemText primaryText={application.position_title} />
                                </ListItem>
                            ))}
                        </MaterialUIBox>
                    ) : (
                            <List nonInteractive>
                                <React.Fragment>
                                    <div><Skeleton duration={1.1} width="40vmin" /></div>
                                    <div><Skeleton duration={1.1} width="60vmin" /></div>
                                    <div><Skeleton duration={1.1} width="50vmin" /></div>
                                </React.Fragment>
                            </List>
                        )
                }

                <React.Fragment>
                    {props.company?.uuid ? <CompanyListItemCheckBox company={props.company} /> : null}
                </React.Fragment>
            </MaterialUIBox>
        </MaterialUIListItem>
    );
}

export {
    CompanyListItem
};