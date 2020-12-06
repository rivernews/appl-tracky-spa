import { relative } from "path";
import { Reducer, Action } from "redux";
import { labelTypes } from "../../data-model/label";
import { RequestStatus } from "../../utils/rest-api";
import { ISelectCompanyState, SelectCompanyActionNames, TSelectCompanyActions } from "../types/select-company-types";

const initialSelectCompanyState: ISelectCompanyState = {
    selectCompanyList: [],
    destinationStatus: labelTypes.APPLIED,
    requestStatus: RequestStatus.SUCCESS
}

export const selectCompanyReducer: Reducer<ISelectCompanyState> = (state = initialSelectCompanyState, action: Action) => {
    const selectCompanyAction = action as TSelectCompanyActions;
    switch (selectCompanyAction.type) {
        case SelectCompanyActionNames.CANCEL_ALL:
            return initialSelectCompanyState;
        
        case SelectCompanyActionNames.ADD_SELECT_COMPANY:
            const foundCompanyId = state.selectCompanyList.find(([companyId,]) => companyId === selectCompanyAction.companyId);
            if (foundCompanyId) {
                return state;
            } else {
                return {
                    ...state,
                    selectCompanyList: [...state.selectCompanyList, [selectCompanyAction.companyId, selectCompanyAction.companyStatus] ]
                }
            }
        
        case SelectCompanyActionNames.REMOVE_SELECT_COMPANY:
            return {
                ...state,
                selectCompanyList: state.selectCompanyList.filter(([companyId,]) => companyId !== selectCompanyAction.companyId)
            }
        
        case SelectCompanyActionNames.SET_DESTINATION_STATUS:
            return {
                ...state,
                destinationStatus: selectCompanyAction.status
            }
        
        case SelectCompanyActionNames.SET_REQUEST_STATUS:
            // if request success, also reset the state
            if (selectCompanyAction.requestStatus === RequestStatus.SUCCESS) {
                return initialSelectCompanyState;
            }
            return {
                ...state,
                requestStatus: selectCompanyAction.requestStatus
            }
    }

    return state;
}