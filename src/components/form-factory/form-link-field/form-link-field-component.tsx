import React, { Component } from "react";

/** Components */
// mdc-react input
import "@material/react-text-field/dist/text-field.css";

import { FormInputFieldMeta } from "../form-input-field/form-input-field-meta";
import { FormInputField } from "../form-input-field/form-input-field";
import { IFormBaseFieldProps } from "../form-base-field/form-base-field-meta";

export interface IFormLinkFieldComponentProps extends IFormBaseFieldProps {
}

export class FormLinkFieldComponent extends Component<IFormLinkFieldComponentProps> {

    textInputFieldProps: FormInputFieldMeta;
    urlInputFieldProps: FormInputFieldMeta;

    constructor(props: IFormLinkFieldComponentProps) {
        super(props)

        this.textInputFieldProps = new FormInputFieldMeta({
            fieldName: `${this.props.fieldName}.text`,
            label: "Description"
        });
        this.urlInputFieldProps = new FormInputFieldMeta({
            fieldName: `${this.props.fieldName}.url`,
            label: "Link url"
        });
    }

    render() {
        return (
            <div className="FormLinkField">
                <h4>{this.props.label}</h4>
                <FormInputField
                    {...this.textInputFieldProps}
                />

                <FormInputField
                    {...this.urlInputFieldProps}
                />
            </div>
        );
    }
}