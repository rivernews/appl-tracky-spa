import React, { Component } from "react";
import { Link } from "react-router-dom";

/** Redux */
import { Company } from "../../store/data-model/company";

/** Components */
import MaterialIcon from "@material/react-material-icon";
// mdc-react icon button
import '@material/react-icon-button/dist/icon-button.css';
import IconButton from '@material/react-icon-button';

interface ICompanyComponentProps {
    company: Company;
    onDeleteIconClicked?: (event: any) => void
    onEditIconClicked?: (event: any) => void
}

export class CompanyComponent extends Component<ICompanyComponentProps> {
    render() {
        const company = this.props.company;
        return (
            <div className="CompanyComponent">
                <p>
                    <Link to={`/com-app/${company.uuid}/`}>
                        {company.name}
                    </Link>
                    <IconButton onClick={this.props.onEditIconClicked}>
                        <MaterialIcon hasRipple icon="edit" />
                    </IconButton>
                    <IconButton onClick={this.props.onDeleteIconClicked}>
                        <MaterialIcon hasRipple icon="delete" />
                    </IconButton>

                    <br />

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
                </p>
            </div>
        );
    }
}
