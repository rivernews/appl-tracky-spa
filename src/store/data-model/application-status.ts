import { RestApiReduxFactory } from "../rest-api-redux-factory";
import { BaseModel, IBaseModelProps, IRelationship } from "./base-model";
import { ApplicationStatusLink } from "./application-status-link";

interface IApplicationStatusProps {
    text?: string;
    application?: IRelationship;
    applicationstatuslink_set?: Array<ApplicationStatusLink>
    date?: string;
    order?: number
}

export class ApplicationStatus extends BaseModel {
    public text: string;
    public application: IRelationship;
    // public applicationstatuslink_set: Array<ApplicationStatusLink>
    public applicationstatuslink_set: Array<ApplicationStatusLink>
    public date: string;
    public order: number;

    constructor({
        text = "",
        application = "",
        // applicationstatuslink_set = [],
        applicationstatuslink_set = [],
        date = "",
        order = 0,
        ...args
    }: IApplicationStatusProps & IBaseModelProps) {
        super(args);
        this.text = text;
        this.application = application;
        // this.applicationstatuslink_set = applicationstatuslink_set;
        this.applicationstatuslink_set = applicationstatuslink_set;
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
