// data model
import { Link } from "../../../store/data-model/link";

/** Components */
// base field
import { IFieldBaseMetaProps, FormBaseFieldMeta } from "../form-base-field/form-base-field-meta";
import { FormLinkField } from "./form-link-field";

export class FormLinkFieldMeta extends FormBaseFieldMeta {

    constructor(props: IFieldBaseMetaProps) {
        super(props)
        this.model = Link;
        this.formField = FormLinkField;
    }
}
