import React, { Component } from "react";

/** Components */
// mdc-react input
import "@material/react-text-field/dist/text-field.css";
// link form
import { FormLinkFieldMeta } from "../form-link-field/form-link-field-meta";
import { FormLinkField } from "../form-link-field/form-link-field";
import { IFormBaseFieldProps } from "../form-base-field/form-base-field-meta";

export interface IFormApplicationStatusLinkFieldComponentProps extends IFormBaseFieldProps {
}

export class FormApplicationStatusLinkFieldComponent extends Component<IFormApplicationStatusLinkFieldComponentProps> {

    linkFieldProps: FormLinkFieldMeta;

    constructor(props: IFormApplicationStatusLinkFieldComponentProps) {
        super(props)

        this.linkFieldProps = new FormLinkFieldMeta({
            fieldName: `${this.props.fieldName}.link`,
            label: ``,
            isDynamic: false, // Link is a one-to-one field in application status link model
        });
    }

    render() {
        return (
            <div className="FormApplicationStatusLinkField">
                {this.props.label && <h4>{this.props.label}</h4>}
                <FormLinkField
                    {...this.linkFieldProps}
                    formikValues={this.props.formikValues}
                    getInstanceDataFromFormikValues={this.props.getInstanceDataFromFormikValues}
                />
            </div>
        );
    }
}