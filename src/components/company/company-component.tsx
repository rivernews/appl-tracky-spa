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
                    <IconButton onClick={this.props.onDeleteIconClicked}>
                        <MaterialIcon hasRipple icon="delete"/>
                    </IconButton>
                    <br />
                    <span>
                        <strong>UUID:</strong> {company.uuid}
                    </span>
                    <br />
                    <span>
                        <strong>HQ:</strong> {company.hq_location.full_address}
                    </span>
                    <br />
                    <a target="_blank" href={company.home_page.url}>
                        <strong>Homepage</strong>
                    </a>
                    <br />
                </p>
            </div>
        );
    }
}
