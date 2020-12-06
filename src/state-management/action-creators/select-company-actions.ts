import { IReference } from "../../data-model/base-model"
import { labelTypes } from "../../data-model/label"
import { RequestStatus } from "../../utils/rest-api"
import { IAddSelectCompanyAction, IApplyAllSelectCompanyChangesAction, ICancelAllSelectCompanyAction, IRemoveSelectCompanyAction, ISetApplyAllSelectCompanyRequestStatusAction, ISetDestinationStatusAction, SelectCompanyActionNames } from "../types/select-company-types"

export const CancelAllSelectCompany = (): ICancelAllSelectCompanyAction => {
    return {
        type: SelectCompanyActionNames.CANCEL_ALL
    }
}

export const AddSelectCompany = (companyId: string, companyStatus: labelTypes): IAddSelectCompanyAction => {
    return {
        type: SelectCompanyActionNames.ADD_SELECT_COMPANY,
        companyId,
        companyStatus
    }
}

export const RemoveSelectCompany = (companyId: string): IRemoveSelectCompanyAction => {
    return {
        type: SelectCompanyActionNames.REMOVE_SELECT_COMPANY,
        companyId
    }
}

export const SetDestinationStatus = (status: labelTypes): ISetDestinationStatusAction => {
    return {
        type: SelectCompanyActionNames.SET_DESTINATION_STATUS,
        status
    }
}

export const ApplyAllSelectCompanyChangesStatus = (selectCompanyList: Array<[IReference, labelTypes]>, destinationStatus: labelTypes): IApplyAllSelectCompanyChangesAction => {
    return {
        type: SelectCompanyActionNames.APPLY_ALL_CHANGES,
        selectCompanyList,
        destinationStatus
    }
}

export const SetApplyAllSelectCompanyRequestStatus = (requestStatus: RequestStatus): ISetApplyAllSelectCompanyRequestStatusAction => {
    return {
        type: SelectCompanyActionNames.SET_REQUEST_STATUS,
        requestStatus
    }
}
