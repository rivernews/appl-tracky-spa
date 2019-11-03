import React, { Component } from "react";

/** Components */
// mdc react icon
import MaterialIcon from "@material/react-material-icon";
// mdc react button
import "@material/react-button/dist/button.css";
// mdc-react input
import "@material/react-text-field/dist/text-field.css";
import TextField, { Input } from "@material/react-text-field";
// formik
import {
    Field, FieldProps,
    ErrorMessage,
} from "formik";
// input field
import { IFormInputFieldProps } from "./form-input-field-meta";
import { InputFieldType } from "../form-base-field/form-base-field-meta";

import styles from "./form-input-field.module.css";


export class FormInputField extends Component<IFormInputFieldProps> {
    render() {
        return (
            <div className="FormInputField">
                <Field
                    name={this.props.fieldName}
                    render={({ field, form }: FieldProps<number | string>) => (
                        <TextField
                            className={styles.TextField}
                            label={this.props.label}
                            onTrailingIconSelect={this.props.onTrailingIconSelect}
                            trailingIcon={this.props.onTrailingIconSelect && <MaterialIcon role="button" icon="clear" />}
                        >
                            <Input
                                type={this.props.type || InputFieldType.TEXT}
                                inputType="input"
                                autoFocus={this.props.autoFocus}
                                {...field}
                            />
                        </TextField>
                    )}
                />
                <ErrorMessage name={this.props.fieldName} />
            </div>
        );
    }
}