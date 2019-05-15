import { FormikValues } from "formik";
import { DataModel } from "../../../store/data-model/base-model";

export enum InputFieldType {
    // https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input
    TEXT = "text",
    PASSWORD = "password",
    EMAIL = "email",
    URL = "url",
    DATE = "date"
}

export interface IFieldBaseMetaProps {
    fieldName: string
    label: string

    model?: DataModel

    isDynamic?: boolean;
    dynamicLimit?: number;
    getInstanceDataFromFormikValues?: (formikValues: FormikValues) => any
}

export interface IFormBaseFieldProps extends IFieldBaseMetaProps {
    formikValues?: FormikValues
    getInstanceDataFromFormikValues: (formikValues: FormikValues) => any
}

interface IFormBaseFieldMeta extends IFieldBaseMetaProps {
    getInstance: (values: FormikValues) => any
}

export class FormBaseFieldMeta implements IFormBaseFieldMeta {
    fieldName: string
    label: string

    model?: DataModel

    isDynamic?: boolean;
    dynamicLimit?: number;
    getInstanceDataFromFormikValues: (formikValues: FormikValues) => any

    constructor(props: IFieldBaseMetaProps) {
        this.fieldName = props.fieldName;
        this.label = props.label;

        this.model = props.model;
        
        this.isDynamic = props.isDynamic;
        this.dynamicLimit = props.dynamicLimit;
        if (props.getInstanceDataFromFormikValues) {
            this.getInstanceDataFromFormikValues = props.getInstanceDataFromFormikValues;
        }
        else {
            this.getInstanceDataFromFormikValues = (values: FormikValues) => {
                if (!values && this.isDynamic) {
                    return [];
                }
        
                return values[this.fieldName];
            }
        }
        
    }

    getInstance(values: FormikValues) {
        const model = this.model;
        if (model) {
            if (this.isDynamic) {
            
                return this.getInstanceDataFromFormikValues(values).map((instanceData: any) => new model(instanceData))
            }
            else {
                return new model(values[this.fieldName]);
            }
        }
        
        // assume field values are plain string/num or other basic types
        return values[this.fieldName];
    }
}