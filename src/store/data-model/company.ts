import { RestApiReduxFactory } from "../rest-api-redux-factory";
import { BaseModel, IBaseModelProps } from "./base-model";

interface ICompanyProps {
    userID?: string;
    labels?: any;
    name?: string;
    hq_location?: any;
    home_page?: any;
    ratings?: any;
    applications?: any;
}

export class Company extends BaseModel {
    public userID: string;
    public labels: any;
    public name: string;
    public hq_location: any;
    public home_page: any;
    public ratings: any;
    public applications: any;

    constructor({
        userID = "",
        labels = [],
        name = "",
        hq_location = {},
        home_page = {},
        ratings = {},
        applications = {},
        ...args
    }: ICompanyProps & IBaseModelProps) {
        super(args);
        this.userID = userID;
        this.labels = labels;
        this.name = name;
        this.hq_location = hq_location;
        this.home_page = home_page;
        this.ratings = ratings;
        this.applications = applications;
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
