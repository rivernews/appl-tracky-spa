import React, { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { IRootState } from "../../state-management/types/root-types";

import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';

import { labelTypes } from "../../data-model/label";
import { ApplyAllSelectCompanyChangesStatus, CancelAllSelectCompany, SetDestinationStatus } from "../../state-management/action-creators/select-company-actions";
import { RequestStatus } from "../../utils/rest-api";

import { MuiThemeProvider, makeStyles } from "@material-ui/core/styles";
import { darkTheme } from "../themes";
import Chip from "@material-ui/core/Chip";
import Typography from "@material-ui/core/Typography";


const  useCompanyDropdownListStyle = makeStyles({
    chip: {
        marginRight: '.5rem'
    }
})

const CompanyDropdownList = () => {
    const classes = useCompanyDropdownListStyle();
    const selectCompanyCollection = useSelector((state: IRootState) => state.selectCompany.selectCompanyCollection);
    const [menuAnchorElement, setMenuAnchorElement] = useState<null | HTMLElement>(null);

    const onMenuClick = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
        setMenuAnchorElement(event.currentTarget);
    }, [])

    const closeMenu = useCallback(() => {
        setMenuAnchorElement(null);
    }, [])

    return (
        <>
            <Button onClick={onMenuClick} size="small">{selectCompanyCollection.size} companies</Button>
            <Menu anchorEl={menuAnchorElement} keepMounted open={Boolean(menuAnchorElement)} onClose={closeMenu}>
                {[...selectCompanyCollection].map(([uuid, company], index) => {
                    // only support single label/status on company for now
                    const label = company.labels.length ? company.labels[0].text : null;
                    return (
                        <MenuItem key={index} dense>
                            {label ? (
                                <Chip className={classes.chip} label={company.labels[0].text} size="small" 
                                    color={label === labelTypes.INTERVIEWING ? 'secondary' :
                                        label === labelTypes.TARGET ? 'primary' : 'default'}
                                />
                            ) : null}
                            <Typography noWrap>
                                {company.name} 
                            </Typography>
                        </MenuItem>
                    )
                })}
            </Menu>
        </>
    )
}

interface ICompanyStatusDropdownListItem {
    label: labelTypes;
    onSelect: () => void
}

const CompanyStatusDropdownListItem = ({ label, onSelect }: ICompanyStatusDropdownListItem) => {
    const dispatch = useDispatch();
    const stagedStatus = useSelector((state: IRootState) => state.selectCompany.destinationStatus);

    const onDropdownListItemSelected = useCallback(() => {
        dispatch(SetDestinationStatus(label));
        onSelect && onSelect();
    }, [dispatch, onSelect, label])

    return (
        <MenuItem selected={stagedStatus === label} onClick={onDropdownListItemSelected}>{label}</MenuItem>
    )
}

export const SelectCompanyMenu = () => {
    const dispatch = useDispatch();
    const selectCompanyApplyRequestStatus = useSelector((state: IRootState) => state.selectCompany.requestStatus);
    const stagedStatus = useSelector((state: IRootState) => state.selectCompany.destinationStatus);

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

    const onDropdownListClick = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    }, [])

    const closeDropdownList = useCallback(() => {
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
            Move <CompanyDropdownList /> to 

            <Button aria-controls="simple-menu" aria-haspopup="true" onClick={onDropdownListClick}>
                {stagedStatus} <ArrowDropDownIcon />
            </Button>
            <Menu
                id="simple-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={closeDropdownList}
            >
                {Object.values(labelTypes).map((label, index) => {
                    return <div key={index}>
                        <CompanyStatusDropdownListItem label={label} onSelect={closeDropdownList} />
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