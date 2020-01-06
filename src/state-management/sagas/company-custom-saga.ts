import { ISuccessSagaHandlerArgs, IObjectStore } from "../rest-api-redux-factory";
import { CrudType, RequestStatus } from "../../utils/rest-api";
import { Company, labelTypesMapToCompanyGroupTypes } from "../../data-model/company/company";
import { CompanyActionCreators, GroupedCompanyActionCreators, ApplicationStatusActionCreators, ApplicationActionCreators } from "../action-creators/root-actions";

import { put, select } from "redux-saga/effects";
import { getApplicationStore } from "../store/store-config";
import { Application } from "../../data-model/application/application";
import { IReference } from "../../data-model/base-model";


export const companyDoneUpdateSuccessSagaHandler = function*(args: ISuccessSagaHandlerArgs<Company>) {
    if (!args.data || (Array.isArray(args.data) && !args.data.length)) {
        return;
    }
    // we need:
    // destination group action, jsonResponse
    // current group action
    const destinationCompany = Array.isArray(args.data) ? args.data[0] : args.data;
    const destinationLabelText = Company.getLabel(destinationCompany);

    // formData will always be a single company since we are dealing with Update only
    const currentCompany = args.updateFromObject as Company;
    const currentLabelText = Company.getLabel(currentCompany);

    // update ref in grouped redux
    if (destinationLabelText === currentLabelText) {
        return;
    }

    // TODO:
    // 1) dispatch a success/CREATE action of the new label redux (company).
    // get destination group's action
    // dispatch it
    const destinationCreateAction = GroupedCompanyActionCreators[labelTypesMapToCompanyGroupTypes[destinationLabelText]][CrudType.CREATE][RequestStatus.SUCCESS].action;
    yield put(
        destinationCreateAction({ uuid: destinationCompany.uuid })
    );
    
    // 2) dispatch a success/DELETE action of the original (current) label redux. 
    // dispatch current group action
    const currentDeleteAction = GroupedCompanyActionCreators[labelTypesMapToCompanyGroupTypes[currentLabelText]][CrudType.DELETE][RequestStatus.SUCCESS].action;
    yield put(
        currentDeleteAction(undefined, { uuid: currentCompany.uuid })
    );
}
export const companyOverrideDeleteSuccessSagaHandler = function*(args: ISuccessSagaHandlerArgs<Company>) {
    if (!args.data || (Array.isArray(args.data) && !args.data.length)) {
        return;
    }
    // delete ref in grouped company redux
    const currentCompany = Array.isArray(args.data) ? args.data[0] : args.data;
    const currentLabelText = Company.getLabel(currentCompany);
    const currentAction = GroupedCompanyActionCreators[labelTypesMapToCompanyGroupTypes[currentLabelText]][CrudType.DELETE][RequestStatus.SUCCESS].action;
    yield put(
        currentAction(undefined, { uuid: currentCompany.uuid })
    );

    // handle cascade delete - delete relational data in their redux
    
    // delete related statuses
    const applicationStore: IObjectStore<Application> = yield select(getApplicationStore);
    alert(`currentCompany applications: ${JSON.stringify(currentCompany.applications)}`);
    const deleteStatusUuids = (currentCompany.applications as Array<IReference>).flatMap((applicationUuid) => {
        alert(`flatMap, application uuid: ${applicationUuid}`);
        alert(`applicationUuid in applicationStore.collection?: ${applicationUuid in applicationStore.collection}`);
        alert(`hasownProperty?: ${applicationStore.collection.hasOwnProperty(applicationUuid)}`);
        alert(`statuses?: ${JSON.stringify(applicationStore.collection[applicationUuid].statuses)}`);
        return applicationUuid in applicationStore.collection ? (
            applicationStore.collection[applicationUuid].statuses as Array<IReference>
        ) : []
    });
    alert(`cascade delete statuses: ${JSON.stringify(deleteStatusUuids)}`);

    yield put(
        ApplicationStatusActionCreators[CrudType.DELETE][RequestStatus.SUCCESS].action(
            undefined,
            deleteStatusUuids
        )
    );

    // delete related applications
    yield put(
        ApplicationActionCreators[CrudType.DELETE][RequestStatus.SUCCESS].action(
            undefined,
            currentCompany.applications
        )
    );

    // handle deleting company itself
    yield put(
        CompanyActionCreators[CrudType.DELETE][RequestStatus.SUCCESS].action(
            undefined,
            currentCompany
        )
    );
}

// grouped redux can only do api call when it's fetch (LIST), using the absolute url when dispatching TRIGGER action (in login saga).
// if operation is others like UPDATE, CREATE, DELETE, then cannot do api call because the absolute url might not work for POST/PATCH/DELET.
export const groupedCompanyListSuccessSagaHandler = function*(args: ISuccessSagaHandlerArgs<Company>) {
    // In redux factory saga, already ensure the right CRUD so no need to check crudType

    if (!args.data || Array.isArray(args.data) && !args.data.length) {
        return;
    }

    const fetchedCompanyList: Array<Company> = Array.isArray(args.data) ? args.data : [args.data];

    const currentLabelText = Company.getLabel(fetchedCompanyList[0]);

    // normalize company's relational data
    // const normalizedCompanyData = normalize(fetchedCompanyList, CompanyListNormalizeSchema);

    // console.log('\n\nnormalizedCompanyData', normalizedCompanyData);

    // console.log('\n\n\nLIST application start');
    // // place application objects in its store
    // if (normalizedCompanyData.entities.applications) {
    //     yield put(
    //         ApplicationActionCreators[CrudType.LIST][RequestStatus.SUCCESS].action({
    //             results: Object.values(normalizedCompanyData.entities.applications)
    //         })
    //     );
    // }
    // // place status objects in its store
    // console.log('\n\n\nLIST status start');
    // if (normalizedCompanyData.entities.statuses) {
    //     yield put(
    //         ApplicationStatusActionCreators[CrudType.LIST][RequestStatus.SUCCESS].action({
    //             results: Object.values(normalizedCompanyData.entities.statuses)
    //         })
    //     );
    // }
    // // place company objects in pool redux
    // console.log('\n\n\nLIST companies start');
    yield put(
        CompanyActionCreators[CrudType.LIST][RequestStatus.SUCCESS].action({
            results: fetchedCompanyList
        })
    );
    
    // console.log('LIST companies done');

    // place "pointers", i.e., uuids, of company objects to grouped redux
    const fetchedCompanyListUuids = fetchedCompanyList.map(company => ({
        uuid: company.uuid
    }));
    yield put(
        GroupedCompanyActionCreators[labelTypesMapToCompanyGroupTypes[currentLabelText]][CrudType.LIST][RequestStatus.SUCCESS].action({ results: fetchedCompanyListUuids })
    );
}