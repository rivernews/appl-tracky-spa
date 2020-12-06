import Checkbox from "@material-ui/core/Checkbox";
import React, { useCallback } from "react";
import { useDispatch } from "react-redux";
import { Company } from "../../data-model/company/company";
import { labelTypes } from "../../data-model/label";
import { AddSelectCompany, RemoveSelectCompany } from "../../state-management/action-creators/select-company-actions";


interface ICompanyListItemCheckBoxProps {
    company: Company;
}

const CompanyListItemCheckBox = ({ company: { uuid: companyId, labels } }: ICompanyListItemCheckBoxProps) => {
    const dispatch = useDispatch();
    
    const onCheckBoxChange = useCallback((event) => {
        if (event.target.checked) {
            // support only single label/status for now
            // for companies that does not have status set, default to `target`
            dispatch(AddSelectCompany(companyId, labels.length ? labels[0].text : labelTypes.TARGET));
        } else {
            dispatch(RemoveSelectCompany(companyId));
        }
    }, [dispatch, companyId, labels])

    return (
        <Checkbox
            edge="end"
            onChange={onCheckBoxChange}
        />
    )
}

export default CompanyListItemCheckBox;