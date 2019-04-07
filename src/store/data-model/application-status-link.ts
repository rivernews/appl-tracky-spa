import { RestApiReduxFactory } from "../rest-api-redux-factory";
import { BaseModel, IBaseModelProps, IRelationship } from "./base-model";
import { Link } from "./link";

interface IApplicationStatusLinkProps {
    application_status?: IRelationship;
    link?: Link;
}

export class ApplicationStatusLink extends BaseModel {
    public application_status: IRelationship;
    public link: Link;

    constructor({
        application_status = "",
        link = new Link({}),
        ...args
    }: IApplicationStatusLinkProps & IBaseModelProps) {
        super(args);
        this.application_status = application_status;
        this.link = link;
    }
}