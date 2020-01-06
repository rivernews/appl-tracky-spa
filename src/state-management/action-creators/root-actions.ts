import { RestApiActionCreatorsFactory } from "./action-creator-factory";
import { companyGroupTypes, labelTypesMapToCompanyGroupTypes, Company } from "../../data-model/company/company";
import { IObjectRestApiReduxFactoryActions } from "../rest-api-redux-factory";
import { Application } from "../../data-model/application/application";
import { ApplicationStatus } from "../../data-model/application-status/application-status";


export enum RootActionNames {
    ResetAllStore = "RESET_ALL_STORE"
}

export const resetAllStoreAction = () => {
    return {
        type: RootActionNames.ResetAllStore,
    }
}


// action creators for companies

export const CompanyActionCreators = RestApiActionCreatorsFactory<Company>("companies");

const groupedCompanyActionCreatorsHelper = () => {
    return Object.values(labelTypesMapToCompanyGroupTypes).reduce((accumulated, companyGroupText) => {
        return {
            ...accumulated,
            [companyGroupText]: RestApiActionCreatorsFactory<Company>(companyGroupText)
        }
    }, {});
}
export const GroupedCompanyActionCreators = groupedCompanyActionCreatorsHelper() as {
    [key in companyGroupTypes]: IObjectRestApiReduxFactoryActions
};


// action creators for application

export const ApplicationActionCreators = RestApiActionCreatorsFactory<Application>("applications")


// action creators for status

export const ApplicationStatusActionCreators = RestApiActionCreatorsFactory<ApplicationStatus>("application-statuses")