// formik
import {
    FormikValues,
} from "formik";
// base field
import { IFormBaseFieldProps, InputFieldType, FormBaseFieldMeta } from "../form-base-field/form-base-field-meta";


export interface IFormInputFieldProps extends IFormBaseFieldProps {
    type?: InputFieldType
    onTrailingIconSelect?: () => void
}

export class FormInputFieldMeta extends FormBaseFieldMeta {
    constructor({
        type,
        onTrailingIconSelect,
        ...props
    }: IFormInputFieldProps) {
        super(props)
    }

    getValueInstance = (values: FormikValues) => {
        return values[this.fieldName];
    }
}