import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { IRootState } from "../../state-management/types/root-types";

import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';

import { labelTypes } from "../../data-model/label";
import { ApplyAllSelectCompanyChangesStatus, CancelAllSelectCompany, SetDestinationStatus } from "../../state-management/action-creators/select-company-actions";
import { RequestStatus } from "../../utils/rest-api";

import { MuiThemeProvider } from "@material-ui/core/styles";
import { darkTheme } from "../themes";

interface ICompanyStatusDropdownListItem {
    label: labelTypes;
    onSelect: () => void
}

const CompanyStatusDropdownListItem = ({ label, onSelect }: ICompanyStatusDropdownListItem) => {
    const dispatch = useDispatch();

    const onDropdownListItemSelected = useCallback(() => {
        dispatch(SetDestinationStatus(label));
        onSelect && onSelect();
    }, [dispatch, onSelect, label])

    return (
        <MenuItem onClick={onDropdownListItemSelected}>{label}</MenuItem>
    )
}

export const SelectCompanyMenu = () => {
    const dispatch = useDispatch();
    const selectCompanyApplyRequestStatus = useSelector((state: IRootState) => state.selectCompany.requestStatus);
    const stagedStatus = useSelector((state: IRootState) => state.selectCompany.destinationStatus);
    const selectCompanyCollection = useSelector((state: IRootState) => state.selectCompany.selectCompanyCollection);

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

    const onDropdownListClick = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    }, [])

    const onDropdownListSelect = useCallback(() => {
        setAnchorEl(null);
    }, [])

    const onApply = useCallback(() => {
        dispatch(ApplyAllSelectCompanyChangesStatus(stagedStatus));
    }, [dispatch, stagedStatus])

    const onCancel = useCallback(() => {
        dispatch(CancelAllSelectCompany());
    }, [dispatch]);
    
    
    return (
        <MuiThemeProvider theme={darkTheme}>
            Move {selectCompanyCollection.size} companies to 

            <Button aria-controls="simple-menu" aria-haspopup="true" onClick={onDropdownListClick}>
                {stagedStatus} <ArrowDropDownIcon />
            </Button>
            <Menu
                id="simple-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
            >
                {Object.values(labelTypes).map((label, index) => {
                    return <div key={index}>
                        <CompanyStatusDropdownListItem label={label} onSelect={onDropdownListSelect} />
                    </div>
                })}
            </Menu>
            <Button onClick={onApply} disabled={selectCompanyApplyRequestStatus === RequestStatus.REQUESTING} size="small" variant="contained">
                Apply
            </Button>
            <Button onClick={onCancel} disabled={selectCompanyApplyRequestStatus === RequestStatus.REQUESTING} size="small" variant="contained">
                Cancel
            </Button>
        </MuiThemeProvider>
    )
}