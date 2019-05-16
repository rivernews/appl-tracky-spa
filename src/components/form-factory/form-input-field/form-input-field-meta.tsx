// base field
import { InputFieldType, FormBaseFieldMeta, IFormBaseFieldProps, IFieldBaseMetaProps } from "../form-base-field/form-base-field-meta";
// input field
import { FormInputField } from "./form-input-field";


// API for caller to new props for input field
export interface IFormInputFieldProps extends IFormBaseFieldProps {
    type?: InputFieldType
    onTrailingIconSelect?: () => void
}

// for defining meta
export interface IFormInputFieldMetaProps extends IFieldBaseMetaProps {
    type?: InputFieldType
    onTrailingIconSelect?: () => void
}

export class FormInputFieldMeta extends FormBaseFieldMeta {
    type?: InputFieldType
    onTrailingIconSelect?: () => void

    constructor({
        type,
        onTrailingIconSelect,
        ...props
    }: IFormInputFieldMetaProps) {
        super(props)
        this.type = type;
        this.onTrailingIconSelect = onTrailingIconSelect;

        this.formField = FormInputField;
    }
}