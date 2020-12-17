import Checkbox from "@material-ui/core/Checkbox";
import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Company } from "../../data-model/company/company";
import { AddSelectCompany, RemoveSelectCompany } from "../../state-management/action-creators/select-company-actions";
import { IRootState } from "../../state-management/types/root-types";


interface ICompanyListItemCheckBoxProps {
    company: Company;
}

const CompanyListItemCheckBox = ({ company }: ICompanyListItemCheckBoxProps) => {
    const dispatch = useDispatch();
    const selectCompanyCollection = useSelector((state: IRootState) => state.selectCompany.selectCompanyCollection);
    
    const onCheckBoxChange = useCallback((event) => {
        if (event.target.checked) {
            dispatch(AddSelectCompany(company));
        } else {
            dispatch(RemoveSelectCompany(company.uuid));
        }
    }, [dispatch, company])

    return (
        <Checkbox
            edge="end"
            checked={selectCompanyCollection.has(company.uuid)}
            onChange={onCheckBoxChange}
        />
    )
}

export default CompanyListItemCheckBox;