// base field
import { FormBaseFieldMeta, IFormBaseFieldProps, IFieldBaseMetaProps } from "../form-base-field/form-base-field-meta";
// input field
import { FormRichTextField } from "./form-rich-text-field";


// API for caller to new props for input field
export interface IFormRichTextFieldProps extends IFormBaseFieldProps {
    onSaveKeystroke?: () => void
}

// for defining meta
export interface IFormRichTextFieldMetaProps extends IFieldBaseMetaProps {
}

export class FormRichTextFieldMeta extends FormBaseFieldMeta {

    constructor(props: IFormRichTextFieldMetaProps) {
        super(props)
        this.formField = FormRichTextField;
    }
}