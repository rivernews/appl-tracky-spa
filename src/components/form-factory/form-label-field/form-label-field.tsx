import React, { Component } from "react";

/** Components */
import { LabelGroupComponentContainer } from "../../label/label-group-component";
import { labelTypes } from "../../../data-model/label";
import { Label } from "../../../data-model/label";
// formik
import {
    Field, FieldProps,
    ErrorMessage,
} from "formik";
// label field
import { IFormLabelFieldProps } from "./form-label-field-meta";


export class FormLabelField extends Component<IFormLabelFieldProps> {

    render() {
        return (
            <div className="FormLabelField">
                <Field
                    name={this.props.fieldName}
                    render={({ field, form }: FieldProps<number | string>) => (
                        <LabelGroupComponentContainer 
                            titleText={this.props.label}
                            selectedLabels={field.value}
                            onChange={(selectedLabelText: labelTypes) => {
                                form.setFieldValue(field.name, [new Label({
                                    text: selectedLabelText
                                })]);
                            }}
                        />
                    )}
                />
                <ErrorMessage name={this.props.fieldName} />
            </div>
        );
    }
}
