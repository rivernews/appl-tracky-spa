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
        date = ApplicationStatus.localeNowDateString(),
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

            // date: Yup.string().matches(/[01]\d{1}[-/][0123]\d{1}[-/]\d{4}/), // TODO: not working, always invalid, figure out why
            date: Yup.string().length(10), // workaround
            
            order: Yup.number()
        });
    }

    static localeNowDateString() {
        const now = new Date();
        const localeNow = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getDate() ));
        const localeNowTimeString = localeNow.toISOString().split("T")[0]
        return localeNowTimeString;
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
