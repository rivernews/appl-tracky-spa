import Checkbox from "@material-ui/core/Checkbox";
import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Company } from "../../data-model/company/company";
import { labelTypes } from "../../data-model/label";
import { AddSelectCompany, RemoveSelectCompany } from "../../state-management/action-creators/select-company-actions";
import { IRootState } from "../../state-management/types/root-types";


interface ICompanyListItemCheckBoxProps {
    company: Company;
}

const CompanyListItemCheckBox = ({ company: { uuid: companyId, labels } }: ICompanyListItemCheckBoxProps) => {
    const dispatch = useDispatch();
    const selectCompanyCollection = useSelector((state: IRootState) => state.selectCompany.selectCompanyCollection);
    
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
            checked={selectCompanyCollection.has(companyId)}
            onChange={onCheckBoxChange}
        />
    )
}

export default CompanyListItemCheckBox;