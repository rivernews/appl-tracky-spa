export type IRelationship = string;

export type DataModel = new (props: any) => any

export type IGenericDataModel<DataModel> = DataModel & BaseModel

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