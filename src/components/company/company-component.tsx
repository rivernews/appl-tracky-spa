import React, { Component } from "react";
import { Link } from "react-router-dom";

/** Redux */
import { Company } from "../../store/data-model/company";

/** Components */

interface ICompanyComponentProps {
    company: Company
}

export class CompanyComponent extends Component<ICompanyComponentProps> {
    render() {
        const company = this.props.company;
        return (
            <div className="CompanyComponent">
                <Link to={`/com-app/${company.uuid}/`} >Link to {company.name}</Link><br></br>
                <span><strong>UUID:</strong> {company.uuid}</span><br></br>
                <span><strong>HQ:</strong> {company.hq_location.full_address}</span><br></br>
                <a target="_blank" href={company.home_page.url}><strong>Homepage</strong></a><br></br>
            </div>
        )
    }
}