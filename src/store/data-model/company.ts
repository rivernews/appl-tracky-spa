import { RestApiReduxFactory } from "../rest-api-redux-factory";
import { BaseModel, IBaseModelProps } from "./base-model";
import { Address } from "./address";
import { Link } from "./link";

interface ICompanyProps {
    user?: string;
    labels?: any;
    name?: string;
    hq_location?: Address;
    home_page?: Link;
    ratings?: any;
    applications?: any;
}

export class Company extends BaseModel {
    public user: string;
    public labels: any;
    public name: string;
    public hq_location: Address;
    public home_page: Link;
    public ratings: any;
    public applications: any;

    constructor({
        user = "",
        labels = [],
        name = "",
        hq_location = new Address({}),
        home_page = new Link({}),
        ratings = {},
        applications = {},
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

    serialize = () => {

    }
}

const initialCompanyInstance = new Company({});
const CompanyRestApiRedux = RestApiReduxFactory<Company>(
    "companies",
    initialCompanyInstance
);
export const companyActions = CompanyRestApiRedux.actions;
export const companyReducer = CompanyRestApiRedux.storeReducer;
export const companySagas = CompanyRestApiRedux.sagas;
