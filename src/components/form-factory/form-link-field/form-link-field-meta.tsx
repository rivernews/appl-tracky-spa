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

    // getInstance = (values: FormikValues) => {
    //     if (this.isDynamic) {
    //         let instanceList: Array<Link> = super.getInstance(values);
    //         instanceList = instanceList.map((instance: Link) => this.sanitizeInstance(instance))
    //         return instanceList;
    //     }
    //     else {
    //         let instance: Link = super.getInstance(values);
    //         instance = this.sanitizeInstance(instance);
    //         return instance;
    //     }
    // }

    // sanitizeInstance(instance: Link) {
    //     return new Link({
    //         ...instance,
    //         url: (instance.url) ? instance.url : "#"
    //     })
    // }
}
