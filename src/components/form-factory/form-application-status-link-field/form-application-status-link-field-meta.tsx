// data model
import { ApplicationStatusLink } from "../../../store/data-model/application-status-link";

/** Components */
import { FormBaseFieldMeta, IFieldBaseMetaProps } from "../form-base-field/form-base-field-meta";

export class FormApplicationStatusLinkFieldMeta extends FormBaseFieldMeta {

    constructor(props: IFieldBaseMetaProps) {
        super(props)
        this.model = ApplicationStatusLink;
    }
}
