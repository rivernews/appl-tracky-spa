import { BaseModel, IBaseModelProps } from "./base-model";
import * as Yup from "yup";

interface ILabelProps {
    text?: string;
    user?: any;
    color?: string;
    order?: number;
}

export class Label extends BaseModel {
    public text: string;
    public user: any;
    public color: string;
    public order: number;

    constructor({
        text = "",
        user = {},
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
