import { RestApiReduxFactory } from "../rest-api-redux-factory";
import { BaseModel, IBaseModelProps, IRelationship } from "./base-model";
import { Link } from "./link";

interface IApplicationProps {
    user?: string;
    user_company?: IRelationship;
    position_title?: string;
    job_description_page?: Link;
    job_source?: Link;
    labels?: any;
}

export class Application extends BaseModel {
    public user: string;
    public user_company: IRelationship;
    public position_title: string;
    public job_description_page: Link;
    public job_source: Link;
    public labels: any;

    constructor({
        user = "",
        user_company = "",
        position_title = "",
        job_description_page = new Link({}),
        job_source = new Link({}),
        labels = {},
        ...args
    }: IApplicationProps & IBaseModelProps) {
        super(args);
        this.user = user;
        this.user_company = user_company;
        this.position_title = position_title;
        this.job_description_page = job_description_page;
        this.job_source = job_source;
        this.labels = labels;
    }
}

const initialApplicationInstance = new Application({});
const ApplicationRestApiRedux = RestApiReduxFactory<Application>(
    "applications",
    initialApplicationInstance
);
export const ApplicationActions = ApplicationRestApiRedux.actions;
export const ApplicationReducer = ApplicationRestApiRedux.storeReducer;
export const ApplicationSagas = ApplicationRestApiRedux.sagas;
