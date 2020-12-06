import { Reducer, Action } from "redux";
import { IReference } from "../../data-model/base-model";
import { labelTypes } from "../../data-model/label";
import { RequestStatus } from "../../utils/rest-api";
import { ISelectCompanyState, SelectCompanyActionNames, TSelectCompanyActions } from "../types/select-company-types";

const initialSelectCompanyState: ISelectCompanyState = {
    selectCompanyCollection: new Map<IReference, labelTypes>(),
    destinationStatus: labelTypes.TARGET,
    requestStatus: RequestStatus.SUCCESS
}

export const selectCompanyReducer: Reducer<ISelectCompanyState> = (state = initialSelectCompanyState, action: Action) => {
    const selectCompanyAction = action as TSelectCompanyActions;
    switch (selectCompanyAction.type) {
        case SelectCompanyActionNames.CANCEL_ALL:
            return initialSelectCompanyState;
        
        case SelectCompanyActionNames.ADD_SELECT_COMPANY:
            const isFound = state.selectCompanyCollection.has(selectCompanyAction.companyId);
            if (isFound) {
                return state;
            } else {
                return {
                    ...state,
                    selectCompanyCollection: new Map([...state.selectCompanyCollection, [selectCompanyAction.companyId, selectCompanyAction.companyStatus]])
                }
            }
        
        case SelectCompanyActionNames.REMOVE_SELECT_COMPANY:
            return {
                ...state,
                selectCompanyCollection: new Map(
                    [...state.selectCompanyCollection]
                        .filter(([uuid,]) => uuid !== selectCompanyAction.companyId)
                )
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