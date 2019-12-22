// base field
import { FormBaseFieldMeta, IFormBaseFieldProps, IFieldBaseMetaProps } from "../form-base-field/form-base-field-meta";
// label field
import { FormLabelField } from "./form-label-field";

// data model
import { Label } from "../../../store/data-model/label";


// API for caller to new props for label field
export interface IFormLabelFieldProps extends IFormBaseFieldProps {
    onTrailingIconSelect?: () => void

    autoFocus?: boolean
}

// for defining meta
export interface IFormLabelFieldMetaProps extends IFieldBaseMetaProps {
    onTrailingIconSelect?: () => void

    autoFocus?: boolean
}

export class FormLabelFieldMeta extends FormBaseFieldMeta {
    onTrailingIconSelect?: () => void

    autoFocus?: boolean

    constructor({
        onTrailingIconSelect,
        autoFocus,
        ...props
    }: IFormLabelFieldMetaProps) {
        super(props)
        this.model = Label;

        this.onTrailingIconSelect = onTrailingIconSelect;
        this.autoFocus = autoFocus;

        this.formField = FormLabelField;
    }
}