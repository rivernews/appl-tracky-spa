import { BaseModel, IBaseModelProps } from "./base-model";

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
}
