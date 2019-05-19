import { RestApiReduxFactory } from "../rest-api-redux-factory";
import { BaseModel, IBaseModelProps, IRelationship } from "./base-model";
import { ApplicationStatusLink } from "./application-status-link";
import * as Yup from "yup";

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
        date = ApplicationStatus.utcNowDateString(),
        order = 0,
        ...args
    }: IApplicationStatusProps & IBaseModelProps) {
        super(args);
        this.text = text;
        this.application = application;
        this.applicationstatuslink_set = applicationstatuslink_set;
        this.date = date;
        this.order = order;
    }

    static schema(){
        return Yup.object<ApplicationStatus>().shape({
            text: Yup.string().required("Give a quick one or two words for the status").max(50, "No more than 50 characters"),
            date: Yup.string().matches(/\d{4}-0{0,1}\d{1}-\d{2}/),
            order: Yup.number()
        });
    }

    static utcNowDateString() {
        const now = new Date();
        const utcNow = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() ));
        const utcNowTimeString = utcNow.toISOString().split("T")[0]
        return utcNowTimeString;
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
