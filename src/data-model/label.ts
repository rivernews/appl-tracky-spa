import { BaseModel, IBaseModelProps } from "./base-model";
import * as Yup from "yup";

interface ILabelProps {
    text?: labelTypes;
    user?: any;
    color?: string;
    order?: number;
}

export class Label extends BaseModel {
    public text: labelTypes;
    public user: any;
    public color: string;
    public order: number;

    constructor({
        text = labelTypes.TARGET,
        user = null,
        color = "",
        order = 0,
        ...args
    }: ILabelProps & IBaseModelProps) {
        super(args);
        this.text = text;
        this.user = user;

        this.color = color;
        this.order = order;
    }

    static schema(){
        return Yup.object<Label>().shape({
            text:  Yup.string().max(200),
            color: Yup.string().max(20),
            order: Yup.number()
        });
    }
}

export enum labelTypes {
    TARGET = "Target",
    APPLIED = "Applied",
    INTERVIEWING = "Interviewing",
    ARCHIVED = "Archived",
}

export enum TabNames {
    ALL = 0,
    TARGET = 1,
    APPLIED = 2,
    INTERVIEWING = 3,
    ARCHIVED = 4
}
