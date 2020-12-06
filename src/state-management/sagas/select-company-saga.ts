import { put, call, takeEvery, all } from "redux-saga/effects";
import { IReference } from "../../data-model/base-model";
import { Company, labelTypesMapToCompanyGroupTypes } from "../../data-model/company/company";
import { labelTypes } from "../../data-model/label";
import { CrudType, RequestStatus, RestApiService } from "../../utils/rest-api";
import { CompanyActionCreators, GroupedCompanyActionCreators } from "../action-creators/root-actions";
import { SetApplyAllSelectCompanyRequestStatus } from "../action-creators/select-company-actions";
import { SelectCompanyActionNames, IApplyAllSelectCompanyChangesAction } from "../types/select-company-types";

function* selectCompanyApplySagaHandler(
    applyAllAction: IApplyAllSelectCompanyChangesAction
) {
    const {
        selectCompanyList, destinationStatus
    } = applyAllAction;

    // use below to dispatch actions
    // yield put(SomeActionCreatorFuncHere)

    const partialUpdateCompanies = selectCompanyList.map(([uuid]) => {
        return {
            uuid,
            labels: [{ text: destinationStatus }]
        }
    });

    let res;
    yield put(SetApplyAllSelectCompanyRequestStatus(RequestStatus.REQUESTING));
    try {
        res = yield call(RestApiService.patch, {
            data: partialUpdateCompanies,
            objectName: 'companies'
        })
        if (!res) {
            throw new Error('Failed to apply company changes. Server response is empty.');
        }
    } catch (error) {
        yield put(SetApplyAllSelectCompanyRequestStatus(RequestStatus.FAILURE));
        console.error('Failed to apply company changes', error)
        // TODO: just do nothing for now, but in the future we may 
        // want to add alerts, danger highlights in UI, etc
        return;
    }

    const updateCompaniesResult = res as Company[];

    // move company uuids out of company buckets
    const removeGroupsMapping = new Map<labelTypes, Set<IReference>>();
    selectCompanyList.forEach(([uuid, label]) => {
        if (label !== destinationStatus) {
            const removeGroupSet = removeGroupsMapping.get(label) || new Set<IReference>();
            removeGroupSet.add(uuid);
            removeGroupsMapping.set(label, removeGroupSet);
        }
    })
    yield all(Array.from(removeGroupsMapping).map(([label, uuidSet]) => {
        const deleteAction = GroupedCompanyActionCreators[
            labelTypesMapToCompanyGroupTypes[label]
        ][CrudType.DELETE][RequestStatus.SUCCESS].action;
        return put(
            deleteAction(undefined, Array.from(uuidSet).map(uuid => ({ uuid })) )
        );
    }));

    // move company uuids into destination company bucket
    const batchCreateAction = GroupedCompanyActionCreators[
        labelTypesMapToCompanyGroupTypes[destinationStatus]
    ][CrudType.BATCHCREATE][RequestStatus.SUCCESS].action;
    yield put(
        batchCreateAction(updateCompaniesResult.map(company => {
            return { uuid: company.uuid }
        }))
    )
    
    // update companies (TODO: limit to just status, but need to pull in company redux state)
    const batchUpdateAction = CompanyActionCreators[CrudType.BATCHUPDATE][RequestStatus.SUCCESS].action;
    yield put(
        batchUpdateAction(updateCompaniesResult.map(company => {
            return { uuid: company.uuid, labels: company.labels }
        }))
    );

    yield put(
        SetApplyAllSelectCompanyRequestStatus(RequestStatus.SUCCESS)
    );
    return;
}

export function* selectCompanyApplySaga(): Generator {
    yield takeEvery(SelectCompanyActionNames.APPLY_ALL_CHANGES, selectCompanyApplySagaHandler);
}