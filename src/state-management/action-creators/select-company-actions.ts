import { Company } from "../../data-model/company/company"
import { labelTypes } from "../../data-model/label"
import { RequestStatus } from "../../utils/rest-api"
import { IAddSelectCompanyAction, IApplyAllSelectCompanyChangesAction, ICancelAllSelectCompanyAction, IRemoveSelectCompanyAction, ISetApplyAllSelectCompanyRequestStatusAction, ISetDestinationStatusAction, SelectCompanyActionNames } from "../types/select-company-types"

export const CancelAllSelectCompany = (): ICancelAllSelectCompanyAction => {
    return {
        type: SelectCompanyActionNames.CANCEL_ALL
    }
}

export const AddSelectCompany = (company: Company): IAddSelectCompanyAction => {
    return {
        type: SelectCompanyActionNames.ADD_SELECT_COMPANY,
        company
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

export const ApplyAllSelectCompanyChangesStatus = (destinationStatus: labelTypes): IApplyAllSelectCompanyChangesAction => {
    return {
        type: SelectCompanyActionNames.APPLY_ALL_CHANGES,
        destinationStatus
    }
}

export const SetApplyAllSelectCompanyRequestStatus = (requestStatus: RequestStatus): ISetApplyAllSelectCompanyRequestStatusAction => {
    return {
        type: SelectCompanyActionNames.SET_REQUEST_STATUS,
        requestStatus
    }
}
