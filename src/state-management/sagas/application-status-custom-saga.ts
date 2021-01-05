import { ISuccessSagaHandlerArgs } from "../types/factory-types";
import { IReference } from "../../data-model/base-model";
import { IRootState } from "../types/root-types";
import { Application } from "../../data-model/application/application";
import { ApplicationStatus } from "../../data-model/application-status/application-status";
import { CrudType, RequestStatus } from "../../utils/rest-api";

import { select, put } from "redux-saga/effects";
import { ApplicationActionCreators } from "../action-creators/root-actions";


const getApplicationStore = (store: IRootState) => store.application;
export const applicationStatusDoneCreateSuccessSagaHandler = function*(args: ISuccessSagaHandlerArgs<ApplicationStatus>) {
    if (!args.data || (Array.isArray(args.data) && !args.data.length)) {
        return;
    }
    const status = (Array.isArray(args.data) ? args.data[0] : args.data) as ApplicationStatus;
    const applicationStore = yield select(getApplicationStore);
    const application = applicationStore.collection[status.application as IReference];
    let updatedApplication = new Application(application);
    updatedApplication.statuses = [
        status.uuid,
        ...updatedApplication.statuses as Array<IReference>
    ];
    yield put(
        ApplicationActionCreators[CrudType.UPDATE][RequestStatus.SUCCESS].action({
            jsonResponse: updatedApplication
        })
    );
}
export const applicationStatusDoneDeleteSuccessSagaHandler = function*(args: ISuccessSagaHandlerArgs<ApplicationStatus>) {
    if (!args.data || (Array.isArray(args.data) && !args.data.length)) {
        return;
    }
    const status = (Array.isArray(args.data) ? args.data[0] : args.data) as ApplicationStatus;
    const applicationStore = yield select(getApplicationStore);
    const application = applicationStore.collection[status.application as IReference];
    let updatedApplication = new Application(application);
    updatedApplication.statuses = (updatedApplication.statuses as Array<IReference>).filter(applicationStatusUuid => applicationStatusUuid !== status.uuid);

    yield put(
        ApplicationActionCreators[CrudType.UPDATE][RequestStatus.SUCCESS].action({
            jsonResponse: updatedApplication
        })
    );
}