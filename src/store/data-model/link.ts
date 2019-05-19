import { BaseModel, IBaseModelProps } from "./base-model";
import * as Yup from "yup";

interface ILinkProps {
    text?: string;
    user?: any;
    url?: string;
    order?: number;
}

export class Link extends BaseModel {
    public text: string;
    public user: any;
    public url: string;
    public order: number;

    constructor({
        text = "",
        user = {},
        url = "",
        order = 0,
        ...args
    }: ILinkProps & IBaseModelProps) {
        super(args);
        this.text = text;
        this.user = user;
        this.url = url;
        this.order = order;
    }

    static schema(){
        return Yup.object<Link>().shape({
            text:  Yup.string(),
            url: Yup.string().default("#").when(
                "text", {
                    is: (text) => text,
                    then: Yup.string().required("Since you gave the link some text, let's provide an url as well...!")
                }
            ),
        });
    }
}
