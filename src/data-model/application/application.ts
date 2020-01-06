import { BaseModel, IBaseModelProps, IRelationship, IReference } from "../base-model";
import { Link } from "../link";
import { ApplicationStatus } from "../application-status/application-status";
import * as Yup from "yup";


interface IApplicationProps {
    user?: IRelationship;
    user_company?: IRelationship;
    position_title?: string;
    job_description_page?: Link;
    job_source?: Link;
    labels?: any;
    notes?: string;
    statuses?: Array<ApplicationStatus> | Array<IReference>;
}

export class Application extends BaseModel {
    public user: IRelationship;
    public user_company: IRelationship;
    public position_title: string;
    public job_description_page: Link;
    public job_source: Link;
    public labels: any;
    public notes: string;
    public statuses: Array<ApplicationStatus> | Array<IReference>;

    constructor({
        user = "",
        user_company = "",
        position_title = "",
        job_description_page = new Link({}),
        job_source = new Link({}),
        labels = {},
        notes = "",
        statuses = [],
        ...args
    }: IApplicationProps & IBaseModelProps) {
        super(args);
        this.user = user;
        this.user_company = user_company;
        this.position_title = position_title;
        this.job_description_page = job_description_page;
        this.job_source = job_source;
        this.labels = labels;
        this.notes = notes;
        this.statuses = statuses;
    }

    static schema(){
        return Yup.object<Application>().shape({
            position_title: Yup.string().required("We need a title...!").max(150, "No more than 150 characters"),
            job_description_page: Link.schema(),
            job_source: Link.schema(),
            notes: Yup.string(),
        });
    }
}
