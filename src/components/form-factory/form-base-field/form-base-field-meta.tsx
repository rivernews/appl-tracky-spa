import React from "react";
import { FormikValues } from "formik";
import { DataModelClass } from "../../../store/data-model/base-model";
import { FormInputField } from "../form-input-field/form-input-field";

export enum InputFieldType {
    // https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input
    TEXT = "text",
    PASSWORD = "password",
    EMAIL = "email",
    URL = "url",
    DATE = "date"
}

// API for caller to new meta class
export interface IFieldBaseMetaProps {
    fieldName: string
    label: string;

    isDynamic?: boolean;
    dynamicLimit?: number;
    getInstanceDataFromFormikValues?: (formikValues: FormikValues) => any
}

// for form field props
export interface IFormBaseFieldProps extends IFieldBaseMetaProps {
    model?: DataModelClass
    formikValues?: FormikValues // for form field to load data (e.g. initial value) at a specific position in formik's `values`
    getInstanceDataFromFormikValues: (formikValues: FormikValues) => any
}

// for the base meta class
interface IFormBaseFieldMeta extends IFieldBaseMetaProps {
    model?: DataModelClass
    formField?: React.ComponentType<IFormBaseFieldProps>
    
    getInstance: (values: FormikValues) => any
    getInstanceDataFromFormikValues: (formikValues: FormikValues) => any
}

export class FormBaseFieldMeta implements IFormBaseFieldMeta {
    fieldName: string
    label: string

    model?: DataModelClass
    formField: React.ComponentType<IFormBaseFieldProps>

    isDynamic?: boolean;
    dynamicLimit?: number;
    getInstanceDataFromFormikValues: (formikValues: FormikValues) => any

    constructor(props: IFieldBaseMetaProps) {
        this.fieldName = props.fieldName;
        this.label = props.label;
        
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
        
        this.formField = FormInputField;
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