import { ISuccessSagaHandlerArgs, IObjectStore, IObjectBase } from "../types/factory-types";
import { CrudType, RequestStatus } from "../../utils/rest-api";
import { Company, companyGroups, companyGroupTypes, labelTypesMapToCompanyGroupTypes } from "../../data-model/company/company";
import { CompanyActionCreators, GroupedCompanyActionCreators, ApplicationStatusActionCreators, ApplicationActionCreators, SearchCompanyActionCreators } from "../action-creators/root-actions";

import { put, select } from "redux-saga/effects";
import { getApplicationStore } from "../store/store-config";
import { Application } from "../../data-model/application/application";
import { IReference } from "../../data-model/base-model";


export const companyDoneUpdateSuccessSagaHandler = function*(args: ISuccessSagaHandlerArgs<Company>) {
    if (!args.data || (Array.isArray(args.data) && !args.data.length)) {
        return;
    }

    const destinationCompany = Array.isArray(args.data) ? args.data[0] : args.data;
    const destinationLabelText = Company.getLabel(destinationCompany);

    // formData will always be a single company since we are dealing with Update only
    const currentCompany = args.updateFromObject as Company;
    const currentLabelText = Company.getLabel(currentCompany);

    // update ref in grouped redux
    if (destinationLabelText === currentLabelText) {
        return;
    }

    // dispatch a success/CREATE action to the destination company group's action
    const destinationCreateAction = GroupedCompanyActionCreators[labelTypesMapToCompanyGroupTypes[destinationLabelText]][CrudType.CREATE][RequestStatus.SUCCESS].action;
    yield put(
        destinationCreateAction({
            jsonResponse: { uuid: destinationCompany.uuid }
        })
    );
    
    // dispatch a success/DELETE action of the original (current) company group 
    const currentDeleteAction = GroupedCompanyActionCreators[labelTypesMapToCompanyGroupTypes[currentLabelText]][CrudType.DELETE][RequestStatus.SUCCESS].action;
    yield put(
        currentDeleteAction({
            triggerFormData: { uuid: currentCompany.uuid }
        })
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
        currentAction({
            triggerFormData: { uuid: currentCompany.uuid }
        })
    );

    // handle cascade delete - delete relational data in their redux
    
    // delete related statuses
    const applicationStore: IObjectStore<Application> = yield select(getApplicationStore);
    alert(`currentCompany applications: ${JSON.stringify(currentCompany.applications)}`);
    const deleteStatusUuids = (currentCompany.applications as Array<IReference>).flatMap((applicationUuid) => {
        return applicationUuid in applicationStore.collection ? (
            applicationStore.collection[applicationUuid].statuses as Array<IReference>
        ) : []
    });
    alert(`cascade delete statuses: ${JSON.stringify(deleteStatusUuids)}`);

    yield put(
        ApplicationStatusActionCreators[CrudType.DELETE][RequestStatus.SUCCESS].action({
            triggerFormData: deleteStatusUuids
        })
    );

    // delete related applications
    yield put(
        ApplicationActionCreators[CrudType.DELETE][RequestStatus.SUCCESS].action({
            triggerFormData: currentCompany.applications
        })
    );

    // handle deleting company itself
    yield put(
        CompanyActionCreators[CrudType.DELETE][RequestStatus.SUCCESS].action({
            triggerFormData: currentCompany
        })
    );
}

// grouped redux can only do api call when it's fetch (LIST), using the absolute url when dispatching TRIGGER action (in login saga).
// if operation is others like UPDATE, CREATE, DELETE, then cannot do api call because the absolute url might not work for POST/PATCH/DELET.
export const groupedCompanyListSuccessSagaHandler = function*(args: ISuccessSagaHandlerArgs<Company>) {
    // In redux factory saga, already ensure the right CRUD so no need to check crudType

    if (!args.data || !Array.isArray(args.data)) {
        return;
    }

    if (!args.companyGroupType) {
        console.error('companyGroupType is not supplied');
        return;
    }

    const fetchedCompanyList: Array<Company> = Array.isArray(args.data) ? args.data : [args.data];

    // place company objects in pool redux
    yield put(
        CompanyActionCreators[CrudType.LIST][RequestStatus.SUCCESS].action({
            jsonResponse: {
                results: fetchedCompanyList
            }
        })
    );

    // place "pointers", i.e., uuids, of company objects to grouped redux
    const fetchedCompanyListUuids = fetchedCompanyList.map(company => ({
        uuid: company.uuid
    }));
    yield put(
        GroupedCompanyActionCreators[args.companyGroupType][CrudType.LIST][RequestStatus.SUCCESS].action({
            jsonResponse: { results: fetchedCompanyListUuids },
            // pass over endCursor for each company group for pagination
            // no need to pass endCursor for `CompanyActionCreators` since company store only serve as saving complete company objects;
            // the UI render (and thus pagination) will be based on each company group's store
            graphqlEndCursor: args.graphqlEndCursor
        })
    );
}

export const searchCompanyListSuccessSagaHandler = function*(args: ISuccessSagaHandlerArgs<Company>) {
    // In redux factory saga, already ensure the right CRUD so no need to check crudType

    if (!args.data || !Array.isArray(args.data)) {
        return;
    }

    const fetchedCompanyList: Array<Company> = Array.isArray(args.data) ? args.data : [args.data];

    // place company objects in pool redux - store the complete object
    yield put(
        CompanyActionCreators[CrudType.LIST][RequestStatus.SUCCESS].action({
            jsonResponse: { results: fetchedCompanyList }
        })
    );

    // place "references/pointers", i.e., uuids, of company objects to grouped redux
    const fetchedCompanyReferenceCollections = {
        ...(companyGroups.reduce((accumulated, companyGroupText) => {
            return {
                ...accumulated,
                [companyGroupText]: []
            }
        }, {}) as {
            [groupText in companyGroupTypes]: Array<IObjectBase>
        }),
        all: [] as Array<IObjectBase>
    };
    // collect all references in one pass
    for (let company of fetchedCompanyList) {
        fetchedCompanyReferenceCollections[
            labelTypesMapToCompanyGroupTypes[ Company.getLabel(company) ]
        ].push({ uuid: company.uuid })
        fetchedCompanyReferenceCollections.all.push({ uuid: company.uuid });
    }
    for (let companyGroupType of companyGroups) {
        const companyReferences = fetchedCompanyReferenceCollections[companyGroupType];
        if (companyReferences.length === 0) {
            continue;
        }

        yield put(
            GroupedCompanyActionCreators[companyGroupType][CrudType.LIST][RequestStatus.SUCCESS].action({
                jsonResponse: { results: companyReferences }
            })
        );
    }

    // place "references/pointers" to searchCompany redux
    yield put(
        SearchCompanyActionCreators[CrudType.LIST][RequestStatus.SUCCESS].action({
            jsonResponse: {
                results: fetchedCompanyReferenceCollections.all,
            },
            // pagination for search company since this is the saga for search,
            // so make sure not to mix up with grouped company's `graphqlEndCursor`
            graphqlEndCursor: args.graphqlEndCursor
        })
    );
}
