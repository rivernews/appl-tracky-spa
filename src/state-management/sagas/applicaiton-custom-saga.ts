import { ISuccessSagaHandlerArgs } from "../types/factory-types";
import { CrudType, RequestStatus } from "../../utils/rest-api";
import { IReference } from "../../data-model/base-model";
import { Company } from "../../data-model/company/company";
import { CompanyActionCreators } from "../action-creators/root-actions";
import { Application } from "../../data-model/application/application";

import { select, put } from "redux-saga/effects";
import { getCompanyStore } from "../store/store-config";


// create a ref (uuid) in the upstream object - company
export const applicationDoneCreateSuccessSagaHandler = function*(args: ISuccessSagaHandlerArgs<Application>) {
    if (!args.data || (Array.isArray(args.data) && !args.data.length)) {
        return;
    }
    const application = (Array.isArray(args.data) ? args.data[0] : args.data) as Application;
    const companyStore = yield select(getCompanyStore);
    const company = companyStore.collection[application.user_company as IReference];
    let updatedCompany = new Company(company);
    updatedCompany.applications = [
        application.uuid,
        ...updatedCompany.applications as Array<IReference>
    ];

    yield put(
        CompanyActionCreators[CrudType.UPDATE][RequestStatus.SUCCESS].action({
            jsonResponse: updatedCompany
        })
    );
}
export const applicationDoneDeleteSuccessSagaHandler = function*(args: ISuccessSagaHandlerArgs<Application>) {
    if (!args.data || (Array.isArray(args.data) && !args.data.length)) {
        return;
    }
    const application = (Array.isArray(args.data) ? args.data[0] : args.data) as Application;
    const companyStore = yield select(getCompanyStore);
    const company = companyStore.collection[application.user_company as IReference];
    let updatedCompany = new Company(company);
    updatedCompany.applications = (updatedCompany.applications as Array<IReference>).filter(applicationUuid => applicationUuid !== application.uuid);

    yield put(
        CompanyActionCreators[CrudType.UPDATE][RequestStatus.SUCCESS].action({
            jsonResponse: updatedCompany
        })
    );
}
