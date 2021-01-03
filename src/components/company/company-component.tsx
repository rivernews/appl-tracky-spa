import React, { Component } from "react";

/** Redux */
import { Company } from "../../data-model/company/company";

/** Components */
import CKEditor from '@shaungc/custom-ckeditor5-react';
import BalloonEditor from '@shaungc/ckeditor5-custom-balloon';

import MaterialIcon from "@material/react-material-icon";
// mdc-react icon button
import '@material/react-icon-button/dist/icon-button.css';
import IconButton from '@material/react-icon-button';
// mdc-chips
import { ChipSet, Chip } from '@material/react-chips';
import "@material/react-chips/dist/chips.css";

import Skeleton from 'react-loading-skeleton';

import styles from './company-component.module.css';


interface ICompanyComponentProps {
    company: Company;
    onDeleteIconClicked?: (event: any) => void
    onEditIconClicked?: (event: any) => void
    actionButtonsDisabled?: boolean
}

export class CompanyComponent extends Component<ICompanyComponentProps> {
    render() {
        const company = this.props.company;

        return (
            <div className="CompanyComponent">
                <div className={styles.companyTitleContainer}>
                    <h1>{company ? company.name : <Skeleton width="50vmin" />}</h1>

                    {company ? (
                        company.labels.length && company.labels[0].text ? (
                            <ChipSet>
                                <Chip label={company.labels[0].text} />
                            </ChipSet>
                        ) : (
                            <ChipSet>
                                <Chip label="None" />
                            </ChipSet>
                        )
                    ) : (
                        <Skeleton width="40px" />
                    )}

                    {/* company link */}
                    {
                        company ? (
                            <IconButton
                                disabled={company.home_page?.url == "#"}
                                isLink={company.home_page?.url != "#"} // isLink=true will make `disabled` useless, a bug
                                target="_blank"
                                href={company.home_page?.url && company.home_page.url.includes('//') ? company.home_page.url : `//${company.home_page?.url}`}>
                                <MaterialIcon hasRipple icon="launch" />
                            </IconButton>
                        ) : (
                                <IconButton disabled>
                                    <MaterialIcon hasRipple icon="launch" />
                                </IconButton>
                            )
                    }

                    {/* company actions */}
                    {
                        <div className="CompanyActionCreators">
                            <IconButton disabled={this.props.actionButtonsDisabled} onClick={this.props.onEditIconClicked}>
                                <MaterialIcon hasRipple icon="edit" />
                            </IconButton>
                            <IconButton disabled={this.props.actionButtonsDisabled} onClick={this.props.onDeleteIconClicked}>
                                <MaterialIcon hasRipple icon="delete" />
                            </IconButton>
                        </div>
                    }
                </div>
                <div className={styles.companyTitleCaption}>{company?.hq_location ? company.hq_location.place_name : <Skeleton />}{company?.hq_location ? company.hq_location.full_address : <Skeleton />}</div>

                {/* notes for company */}
                <div>
                    <h2>Quick Notes (Company Background, Culture, etc)</h2>
                    {company ? (
                        company.notes ? (
                            <CKEditor
                                editor={BalloonEditor}
                                disabled={true}
                                data={company.notes}
                            />
                        ) : <p>No company quick notes yet</p>
                    ) : 
                    <>
                        <div><Skeleton width="70vmin" /></div>
                        <div><Skeleton width="30vmin" /></div>
                    </>}
                </div>
            </div>
        );
    }
}
