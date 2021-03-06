import React, { Component } from "react";

/** Components */
// mdc-react input
import "@material/react-text-field/dist/text-field.css";
import { Overline } from "@material/react-typography";

import { FormInputFieldMeta } from "../form-input-field/form-input-field-meta";
import { FormInputField } from "../form-input-field/form-input-field";
import { IFormBaseFieldProps } from "../form-base-field/form-base-field-meta";


export interface IFormLinkFieldComponentProps extends IFormBaseFieldProps {
}

export class FormLinkFieldComponent extends Component<IFormLinkFieldComponentProps> {

    textInputFieldMeta: FormInputFieldMeta;
    urlInputFieldMeta: FormInputFieldMeta;

    constructor(props: IFormLinkFieldComponentProps) {
        super(props)

        this.textInputFieldMeta = new FormInputFieldMeta({
            fieldName: `${this.props.fieldName}.text`,
            label: "Description",
            autoFocus: true
        });
        this.urlInputFieldMeta = new FormInputFieldMeta({
            fieldName: `${this.props.fieldName}.url`,
            label: "Link url"
        });
    }

    render() {
        return (
            <div className="FormLinkField">
                {this.props.label && <Overline>{this.props.label}</Overline>}
                <FormInputField
                    {...this.textInputFieldMeta}
                />

                <FormInputField
                    {...this.urlInputFieldMeta}
                />
            </div>
        );
    }
}