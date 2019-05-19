import { RestApiReduxFactory } from "../rest-api-redux-factory";
import { BaseModel, IBaseModelProps } from "./base-model";
import { Address } from "./address";
import { Link } from "./link";
import * as Yup from "yup";

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

    static schema(){
        return Yup.object<Company>().shape({
            name: Yup.string().required("Every company needs a name...!"),
            home_page: Link.schema(),
        });
    }
}

const initialCompanyInstance = new Company({});
const CompanyRestApiRedux = RestApiReduxFactory<Company>(
    "companies",
    initialCompanyInstance
);
export const CompanyActions = CompanyRestApiRedux.actions;
export const CompanyReducer = CompanyRestApiRedux.storeReducer;
export const CompanySagas = CompanyRestApiRedux.sagas;
