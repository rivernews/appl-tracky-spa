import { Action } from "redux";
import { IReference } from "../../data-model/base-model";
import { labelTypes } from "../../data-model/label";
import { RequestStatus } from "../../utils/rest-api";

export interface ISelectCompanyState {
    selectCompanyList: Array<[IReference, labelTypes]>;
    destinationStatus: labelTypes;
    requestStatus: RequestStatus;
}

export enum SelectCompanyActionNames {
    CANCEL_ALL = "Cancel all selected company",
    ADD_SELECT_COMPANY = "Add select company",
    REMOVE_SELECT_COMPANY = "Remove select company",
    SET_DESTINATION_STATUS = "Set destination status",
    APPLY_ALL_CHANGES = "Batch apply all company status changes",
    SET_REQUEST_STATUS = "Set select company apply request status",
}

export interface ICancelAllSelectCompanyAction extends Action<SelectCompanyActionNames.CANCEL_ALL> {
    type: typeof SelectCompanyActionNames.CANCEL_ALL;
}

export interface IAddSelectCompanyAction extends Action<SelectCompanyActionNames.ADD_SELECT_COMPANY> {
    type: typeof SelectCompanyActionNames.ADD_SELECT_COMPANY;
    companyId: string;
    companyStatus: labelTypes
}

export interface IRemoveSelectCompanyAction extends Action<SelectCompanyActionNames.REMOVE_SELECT_COMPANY> {
    type: typeof SelectCompanyActionNames.REMOVE_SELECT_COMPANY;
    companyId: string
}

export interface ISetDestinationStatusAction extends Action<SelectCompanyActionNames.SET_DESTINATION_STATUS> {
    type: typeof SelectCompanyActionNames.SET_DESTINATION_STATUS;
    status: labelTypes;
}

export interface IApplyAllSelectCompanyChangesAction extends Action<SelectCompanyActionNames.APPLY_ALL_CHANGES> {
    type: typeof SelectCompanyActionNames.APPLY_ALL_CHANGES;
    selectCompanyList: Array<[IReference, labelTypes]>;
    destinationStatus: labelTypes;
}

export interface ISetApplyAllSelectCompanyRequestStatusAction extends Action<SelectCompanyActionNames.SET_REQUEST_STATUS> {
    type: typeof SelectCompanyActionNames.SET_REQUEST_STATUS;
    requestStatus: RequestStatus
}

export type TSelectCompanyActions = 
    ICancelAllSelectCompanyAction |
    IAddSelectCompanyAction | 
    IRemoveSelectCompanyAction | 
    ISetDestinationStatusAction |
    IApplyAllSelectCompanyChangesAction |
    ISetApplyAllSelectCompanyRequestStatusAction;
