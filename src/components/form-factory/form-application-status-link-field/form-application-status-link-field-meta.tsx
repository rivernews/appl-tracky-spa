// data model
import { ApplicationStatusLink } from "../../../data-model/application-status-link";

/** Components */
import { FormBaseFieldMeta, IFieldBaseMetaProps } from "../form-base-field/form-base-field-meta";
import { FormApplicationStatusLinkField } from "./form-application-status-link-field";

export class FormApplicationStatusLinkFieldMeta extends FormBaseFieldMeta {

    constructor(props: IFieldBaseMetaProps) {
        super(props)
        this.model = ApplicationStatusLink;
        this.formField = FormApplicationStatusLinkField;
    }
}
