import React, { Component } from "react";
import { Link } from "react-router-dom";

/** Redux */
import { Company } from "../../store/data-model/company";

/** Components */
import MaterialIcon from "@material/react-material-icon";
// mdc-react icon button
import '@material/react-icon-button/dist/icon-button.css';
import IconButton from '@material/react-icon-button';

import styles from './company-component.module.css';

interface ICompanyComponentProps {
    company: Company;
    onDeleteIconClicked?: (event: any) => void
    onEditIconClicked?: (event: any) => void
}

export class CompanyComponent extends Component<ICompanyComponentProps> {
    render() {
        const company = this.props.company;
        // alert(`com url = ${company.home_page.url}`);
        console.log(`\n\n\n\n\n${company.home_page.url}, bool? ${company.home_page.url === "#"}`);
        return (
            <div className="CompanyComponent">
                <div className={styles.companyTitleContainer}>
                    <h1>{company.name}</h1>
                    <IconButton
                        disabled={company.home_page.url == "#"}
                        isLink={company.home_page.url != "#"} // isLink=true will make `disabled` useless, a bug
                        target="_blank" 
                        href={company.home_page.url && company.home_page.url.includes('//') ? company.home_page.url : `//${company.home_page.url}`}>
                        <MaterialIcon hasRipple icon="launch" />
                    </IconButton>

                    {/* company actions */}
                    <IconButton onClick={this.props.onEditIconClicked}>
                        <MaterialIcon hasRipple icon="edit" />
                    </IconButton>
                    <IconButton onClick={this.props.onDeleteIconClicked}>
                        <MaterialIcon hasRipple icon="delete" />
                    </IconButton>
                </div>
                <div className={styles.companyTitleCaption}>{company.hq_location.place_name || ""}{company.hq_location.full_address}</div>

                {/* <p>
                    {(company.hq_location.full_address) && <span>
                        <strong>{company.hq_location.place_name || "Location"}:</strong> {company.hq_location.full_address}
                    </span>}

                    <br />

                    {(company.home_page.url) && <span>
                        <strong>Company Website: </strong>
                        {(company.home_page.url) && <a target="_blank" href={
                            (company.home_page.url && company.home_page.url.includes("//")) ?
                                company.home_page.url :
                                `//${company.home_page.url}`
                        }>
                            {company.home_page.text || "Link"}
                        </a>}
                    </span>}

                    <br />
                </p> */}
            </div>
        );
    }
}
