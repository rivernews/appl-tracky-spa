// base field
import { InputFieldType, FormBaseFieldMeta, IFieldBaseMetaProps } from "../form-base-field/form-base-field-meta";


export interface IFormInputFieldProps extends IFieldBaseMetaProps {
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
    }: IFormInputFieldProps) {
        super(props)
        this.type = type;
        this.onTrailingIconSelect = onTrailingIconSelect;
    }
}