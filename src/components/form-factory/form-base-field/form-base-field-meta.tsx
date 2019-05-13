export enum InputFieldType {
    // https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input
    TEXT = "text",
    PASSWORD = "password",
    EMAIL = "email",
    URL = "url",
    DATE = "date"
}

export interface IFormBaseFieldProps {
    fieldName: string
    label: string
    model?: any
}

export class FormBaseFieldMeta {
    fieldName: string
    label: string
    model?: any

    constructor(props: IFormBaseFieldProps) {
        this.fieldName = props.fieldName;
        this.label = props.label;
        this.model = props.model;
    }
}