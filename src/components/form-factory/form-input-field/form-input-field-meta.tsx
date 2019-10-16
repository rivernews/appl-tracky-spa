// base field
import { InputFieldType, FormBaseFieldMeta, IFormBaseFieldProps, IFieldBaseMetaProps } from "../form-base-field/form-base-field-meta";
// input field
import { FormInputField } from "./form-input-field";


// API for caller to new props for input field
export interface IFormInputFieldProps extends IFormBaseFieldProps {
    type?: InputFieldType
    onTrailingIconSelect?: () => void

    autoFocus?: boolean
}

// for defining meta
export interface IFormInputFieldMetaProps extends IFieldBaseMetaProps {
    type?: InputFieldType
    onTrailingIconSelect?: () => void

    autoFocus?: boolean
}

export class FormInputFieldMeta extends FormBaseFieldMeta {
    type?: InputFieldType
    onTrailingIconSelect?: () => void

    autoFocus?: boolean

    constructor({
        type,
        onTrailingIconSelect,
        autoFocus,
        ...props
    }: IFormInputFieldMetaProps) {
        super(props)
        this.type = type;
        this.onTrailingIconSelect = onTrailingIconSelect;
        this.autoFocus = autoFocus;

        this.formField = FormInputField;
    }
}