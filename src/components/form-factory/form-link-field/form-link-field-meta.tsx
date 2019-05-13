// data model
import { Link } from "../../../store/data-model/link";

/** Components */
// formik
import {
    FormikValues,
} from "formik";

import { IFormBaseFieldProps } from "../form-base-field/form-base-field-meta";

export class FormLinkFieldMeta implements IFormBaseFieldProps {
    model = Link;

    fieldName: string;
    label: string;
    isDyanmic?: boolean;

    constructor({
        fieldName,
        label,
        isDyanmic = false
    }: IFormBaseFieldProps & {
        isDyanmic?: boolean
    }) {
        this.fieldName = fieldName;
        this.label = label;
        this.isDyanmic = isDyanmic;
    }

    getValueInstance(values: FormikValues) {
        if (this.isDyanmic) {
            return values[this.fieldName].map((linkData: Link) => new Link(linkData));
        }
        else {
            return new Link(values[this.fieldName]);
        }
    }
}
