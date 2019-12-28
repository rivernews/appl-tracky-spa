import { RestApiReduxFactory, ISuccessSagaHandlerArgs, IRestApiReduxFactory } from "../rest-api-redux-factory";
import { BaseModel, IBaseModelProps } from "./base-model";
import { Address } from "./address";
import { Link } from "./link";
import { Label, labelTypes } from "./label";
import { Application } from "./application";
import * as Yup from "yup";
import { CrudType, RequestStatus, ISingleRestApiResponse } from "../../utils/rest-api";

import { put } from "redux-saga/effects";


interface ICompanyProps {
    user?: string;
    labels?: Array<Label>;
    name?: string;
    hq_location?: Address;
    home_page?: Link;
    ratings?: any;
    applications?: Array<Application>;
}

export class Company extends BaseModel {
    public user: string;
    public labels: Array<Label>;
    public name: string;
    public hq_location: Address;
    public home_page: Link;
    public ratings: any;
    public applications: Array<Application>;

    constructor({
        user = "",
        labels = [],
        name = "",
        hq_location = new Address({}),
        home_page = new Link({}),
        ratings = {},
        applications = [],
        ...args
    }: ICompanyProps & IBaseModelProps) {
        super(args);
        this.user = user;
        this.labels = labels;
        this.name = name;
        this.hq_location = hq_location;
        this.home_page = home_page;
        this.ratings = ratings;
        this.applications = applications;
    }

    static schema(){
        return Yup.object<Company>().shape({
            name: Yup.string().required("Every company needs a name...!").max(100),
            home_page: Link.schema(),
            hq_location: Address.schema()
        });
    }

    static getLabel(companyObject: Company): labelTypes {
        // default to TARGET
        return companyObject.labels && companyObject.labels.length ? companyObject.labels[0].text : labelTypes.TARGET;
    }
}


export type companyGroupTypes = "targetCompany" | "appliedCompany" | "interviewingCompany" | "archivedCompany";

export const labelTypesMapToCompanyGroupTypes: {
    [key in labelTypes]: companyGroupTypes
} = {
    [labelTypes.TARGET]: "targetCompany",
    [labelTypes.APPLIED]: "appliedCompany",
    [labelTypes.INTERVIEWING]: "interviewingCompany",
    [labelTypes.ARCHIVED]: "archivedCompany"
};


const companyDeleteSuccessSagaHandler = function*(args: ISuccessSagaHandlerArgs<Company>) {
    // delete company in pool redux
    yield put(
        CompanyRestApiRedux.actions[CrudType.DELETE][RequestStatus.SUCCESS].action(args.jsonResponse, args.formData)
    );

    // delete ref in grouped redux
    const currentCompany: Company = args.formData as Company;
    const currentLabelText = Company.getLabel(currentCompany);
    const currentAction = GroupedCompanyRestApiRedux[labelTypesMapToCompanyGroupTypes[currentLabelText]].actions[CrudType.DELETE][RequestStatus.SUCCESS].action;
    yield put(
        currentAction(undefined, { uuid: currentCompany.uuid })
    );
}


const companyUpdateSuccessSagaHandler = function*(args: ISuccessSagaHandlerArgs<Company>) {
    // we need:
    // destination group action, jsonResponse
    // current group action
    const destinationCompany = (args.jsonResponse) as ISingleRestApiResponse<Company>;
    const destinationLabelText = Company.getLabel(destinationCompany);

    // formData will always be a single company since we are dealing with Update only
    const currentCompany = args.updateFromObject as Company;
    const currentLabelText = Company.getLabel(currentCompany);

    // update company in pool redux
    yield put(
        CompanyRestApiRedux.actions[CrudType.UPDATE][RequestStatus.SUCCESS].action(destinationCompany)
    );

    // update ref in grouped redux
    if (destinationLabelText === currentLabelText) {
        return;
    }

    // TODO:
    // 1) dispatch a success/CREATE action of the new label redux (company).
    // get destination group's action
    // dispatch it
    const destinationCreateAction = GroupedCompanyRestApiRedux[labelTypesMapToCompanyGroupTypes[destinationLabelText]].actions[CrudType.CREATE][RequestStatus.SUCCESS].action;
    yield put(
        destinationCreateAction({ uuid: destinationCompany.uuid })
    );
    
    // 2) dispatch a success/DELETE action of the original (current) label redux. 
    // dispatch current group action
    const currentDeleteAction = GroupedCompanyRestApiRedux[labelTypesMapToCompanyGroupTypes[currentLabelText]].actions[CrudType.DELETE][RequestStatus.SUCCESS].action;
    yield put(
        currentDeleteAction({}, { uuid: currentCompany.uuid })
    );
}

// grouped redux can only do api call when it's fetch (LIST), using the absolute url when dispatching TRIGGER action (in login saga).
// if operation is others like UPDATE, CREATE, DELETE, then cannot do api call because the absolute url might not work for POST/PATCH/DELET.
const groupedCompanyListSuccessSagaHandler = function*(args: ISuccessSagaHandlerArgs<Company>) {
    // In redux factory saga, already ensure the right CRUD so no need to check crudType

    const fetchedCompanyList: Array<Company> = args.jsonResponse.results;

    if (!fetchedCompanyList.length) {
        return;
    }

    const currentLabelText = Company.getLabel(fetchedCompanyList[0]);

    // place company objects in pool redux
    yield put(
        CompanyRestApiRedux.actions[CrudType.LIST][RequestStatus.SUCCESS].action(args.jsonResponse)
    );

    // place "pointers", i.e., uuids, of company objects to grouped redux
    const fetchedCompanyListUuids = fetchedCompanyList.map(company => ({
        uuid: company.uuid
    }));
    yield put(
        GroupedCompanyRestApiRedux[labelTypesMapToCompanyGroupTypes[currentLabelText]].actions[CrudType.LIST][RequestStatus.SUCCESS].action({ results: fetchedCompanyListUuids })
    );
}


const initialCompanyInstance = new Company({});
const CompanyRestApiRedux: IRestApiReduxFactory<Company> = RestApiReduxFactory<Company>(
    "companies",
    initialCompanyInstance,
    {
        successSagaHandler: {
            update: companyUpdateSuccessSagaHandler,
            delete: companyDeleteSuccessSagaHandler
        }
    }
);
export const CompanyActions = CompanyRestApiRedux.actions;
export const CompanyReducer = CompanyRestApiRedux.storeReducer;
export const CompanySagas = CompanyRestApiRedux.sagas;


const groupedCompanyRestApiReduxFactory = (): {
    [key in companyGroupTypes]?: IRestApiReduxFactory<Company>
} => {
    return Object.values(labelTypesMapToCompanyGroupTypes).reduce((accumulated, companyGroupText) => {
        return {
            ...accumulated,
            [companyGroupText]: RestApiReduxFactory<Company>(
                companyGroupText,
                initialCompanyInstance,
                {
                    successSagaHandler: {
                        list: groupedCompanyListSuccessSagaHandler
                    }
                }
            )
        }
    }, {});
}
export const GroupedCompanyRestApiRedux = groupedCompanyRestApiReduxFactory() as {
    [key in companyGroupTypes]: IRestApiReduxFactory<Company>
};
