import { RestApiReduxFactory } from "../rest-api-redux-factory";
import { BaseModel, IBaseModelProps, IRelationship } from "./base-model";
import { Link } from "./link";

interface IApplicationStatusProps {
    text?: string;
    application?: IRelationship;
    application_status_links?: Array<IRelationship>
    date?: string;
    order?: number
}

export class ApplicationStatus extends BaseModel {
    public text: string;
    public application: IRelationship;
    public application_status_links: Array<IRelationship>
    public date: string;
    public order: number;

    constructor({
        text = "",
        application = "",
        application_status_links = [],
        date = "",
        order = 0,
        ...args
    }: IApplicationStatusProps & IBaseModelProps) {
        super(args);
        this.text = text;
        this.application = application;
        this.application_status_links = application_status_links;
        this.date = date;
        this.order = order;
    }
}

const initialApplicationStatusInstance = new ApplicationStatus({});
const ApplicationStatusRestApiRedux = RestApiReduxFactory<ApplicationStatus>(
    "application-statuses",
    initialApplicationStatusInstance
);
export const ApplicationStatusActions = ApplicationStatusRestApiRedux.actions;
export const ApplicationStatusReducer = ApplicationStatusRestApiRedux.storeReducer;
export const ApplicationStatusSagas = ApplicationStatusRestApiRedux.sagas;
