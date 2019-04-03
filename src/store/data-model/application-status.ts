import { RestApiReduxFactory } from "../rest-api-redux-factory";
import { BaseModel, IBaseModelProps, IRelationship } from "./base-model";
import { Link } from "./link";

interface IApplicationStatusProps {
    text?: string;
}

export class ApplicationStatus extends BaseModel {
    public text: string;

    constructor({
        text = "",
        ...args
    }: IApplicationStatusProps & IBaseModelProps) {
        super(args);
        this.text = text;
    }
}

const initialApplicationStatusInstance = new ApplicationStatus({});
const ApplicationStatusRestApiRedux = RestApiReduxFactory<ApplicationStatus>(
    "application_statuses",
    initialApplicationStatusInstance
);
export const ApplicationStatusActions = ApplicationStatusRestApiRedux.actions;
export const ApplicationStatusReducer = ApplicationStatusRestApiRedux.storeReducer;
export const ApplicationStatusSagas = ApplicationStatusRestApiRedux.sagas;
