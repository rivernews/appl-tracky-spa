import React, { Component } from "react";

/** Redux & data models */
import { Company } from "../../store/data-model/company";
import { Application } from "../../store/data-model/application";

/** Components */
import Card, { CardPrimaryContent } from "@material/react-card";
import '@material/react-card/dist/card.css';
import List, { ListItem, ListItemText } from "@material/react-list";
import '@material/react-list/dist/list.css';

import Skeleton from 'react-loading-skeleton';

interface ICompanyListItemProps {
    company?: Company;
    applications?: Array<Application>
    onClick?: (uuid: string) => void
}

const CompanyListItem = (props: ICompanyListItemProps) => {
    const onClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        props.onClick && props.company && props.onClick(props.company.uuid);
    }

    return (<Card className="companyCard" onClick={onClick}>
    <CardPrimaryContent className="companyCardContent">
        <h1>{props.company ? props.company.name : <Skeleton duration={1.1} width={`50vmin`} />}</h1>
        <List nonInteractive>
            {
                props.applications ? props.applications.map((application: Application) => (
                    <ListItem key={application.uuid}>
                        <ListItemText primaryText={application.position_title} />
                    </ListItem>
                )) : (
                    <div className="skeletonGroup">
                        <div><Skeleton duration={1.1} width="40vmin" /></div>
                        <div><Skeleton duration={1.1} width="60vmin" /></div>
                        <div><Skeleton duration={1.1} width="50vmin" /></div>
                    </div>
                )
            }
        </List>
    </CardPrimaryContent>
</Card>);
}

export {
    CompanyListItem
};