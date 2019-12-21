import React, { Component } from "react";

/** Components */
// mdc react icon
import MaterialIcon from "@material/react-material-icon";
import { LabelGroupComponentContainer, labelTypes } from "../../label/label-group-component";
import { Label } from "../../../store/data-model/label";
// formik
import {
    Field, FieldProps,
    ErrorMessage,
} from "formik";
// label field
import { IFormLabelFieldProps } from "./form-label-field-meta";

import styles from "./form-label-field.module.css";





export class FormLabelField extends Component<IFormLabelFieldProps> {

    render() {
        return (
            <div className="FormLabelField">
                <Field
                    name={this.props.fieldName}
                    render={({ field, form }: FieldProps<number | string>) => (
                        // <TextField
                        //     className={styles.TextField}
                        //     label={this.props.label}
                        //     onTrailingIconSelect={this.props.onTrailingIconSelect}
                        //     trailingIcon={this.props.onTrailingIconSelect && <MaterialIcon role="button" icon="clear" />}
                        // >
                        //     <Input
                        //         type={this.props.type || InputFieldType.TEXT}
                        //         inputType="input"
                        //         autoFocus={this.props.autoFocus}
                        //         {...field}
                        //     />
                        // </TextField>
                        <LabelGroupComponentContainer 
                            selectedLabels={field.value}
                            onChange={(selectedLabelText: string) => {
                                form.setFieldValue(field.name, new Label({
                                    text: selectedLabelText
                                }));
                            }}
                        />
                    )}
                />
                <ErrorMessage name={this.props.fieldName} />
            </div>
        );
    }
}