// data model
import { Address } from "../../../data-model/address";

/** Components */
// base field
import { IFieldBaseMetaProps, FormBaseFieldMeta } from "../form-base-field/form-base-field-meta";
import { FormAddressField } from "./form-address-field";

export class FormAddressFieldMeta extends FormBaseFieldMeta {

    constructor(props: IFieldBaseMetaProps) {
        super(props)
        this.model = Address;
        this.formField = FormAddressField;
    }
}
