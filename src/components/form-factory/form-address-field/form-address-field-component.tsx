import React, { Component } from "react";

/** Components */
// mdc-react input
import "@material/react-text-field/dist/text-field.css";

import { FormInputFieldMeta } from "../form-input-field/form-input-field-meta";
import { FormInputField } from "../form-input-field/form-input-field";
import { IFormBaseFieldProps } from "../form-base-field/form-base-field-meta";

export interface IFormAddressFieldComponentProps extends IFormBaseFieldProps {
}

export class FormAddressFieldComponent extends Component<IFormAddressFieldComponentProps> {

    fullAddressInputFieldMeta: FormInputFieldMeta;
    placeNameInputFieldMeta: FormInputFieldMeta;

    constructor(props: IFormAddressFieldComponentProps) {
        super(props)

        this.fullAddressInputFieldMeta = new FormInputFieldMeta({
            fieldName: `${this.props.fieldName}.full_address`,
            label: `Full Address`
        });
        this.placeNameInputFieldMeta = new FormInputFieldMeta({
            fieldName: `${this.props.fieldName}.place_name`,
            label: `Place Name`
        });
    }

    render() {
        return (
            <div className="FormAddressField">
                {this.props.label && <h4>{this.props.label}</h4>}
                
                <FormInputField
                    {...this.placeNameInputFieldMeta}
                />

                <FormInputField
                    {...this.fullAddressInputFieldMeta}
                />
                
            </div>
        );
    }
}