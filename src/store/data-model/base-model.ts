export type IRelationship = string;

export type DataModelClass = new (props: any) => any

export interface IBaseModelProps {
    uuid?: IRelationship
    created_at?: string
    modified_at?: string
}

export class BaseModel {
    uuid: string
    created_at: string
    modified_at: string
    
    constructor({
        uuid = "",
        created_at = "",
        modified_at = "",
    }: IBaseModelProps) {
        this.uuid = uuid;
        this.created_at = created_at;
        this.modified_at = modified_at;
    }
}

// for newing model class instance and access base class's assets
export type DataModelInstance<Model = BaseModel> = Model & BaseModel