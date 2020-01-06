import * as Yup from "yup";
import { schema, Schema } from 'normalizr';


export type IReference = string;

export type IRelationship = {
    uuid: string
} | IReference;

export interface IBaseModelProps {
    uuid?: string
    created_at?: string
    modified_at?: string
}

export class BaseModel {
    uuid: string
    created_at: string
    modified_at: string

    normalizeSchemaShape?: Schema
    objectNamePlural?: string
    
    constructor({
        uuid = "",
        created_at = "",
        modified_at = "",
    }: IBaseModelProps) {
        this.uuid = uuid;
        this.created_at = created_at;
        this.modified_at = modified_at;
    }

    static schema() {
        return Yup.object<BaseModel>().shape({});
    }

    getNormalizeSchema() {
        if (this.normalizeSchemaShape && this.objectNamePlural) {
            return new schema.Entity(this.objectNamePlural, this.normalizeSchemaShape, {
                idAttribute: "uuid"
            })
        }

        return null;
    }

    getListNormalizeSchema() {
        const normalizeSchema = this.getNormalizeSchema();
        if (normalizeSchema) {
            return new schema.Array(normalizeSchema);
        }

        return null;
    }
}

// for newing model class instance and access base class's assets
export type DataModelInstance<Model = BaseModel> = Model & BaseModel

export type DataModelClass<DataModel = any> = DataModelInstance<DataModel> & (new (props: any) => DataModel)
