import React, { Component } from "react";
import { withRouter, RouteComponentProps } from "react-router-dom";

/** Redux */
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { IRootState } from "../../store/types";

/** Components */
// mdc react icon
import MaterialIcon from "@material/react-material-icon";
// mdc react button
import "@material/react-button/dist/button.css";
import Button from "@material/react-button";
// mdc-react input
import "@material/react-text-field/dist/text-field.css";
import TextField, { HelperText, Input } from "@material/react-text-field";
// formik
import {
    Formik,
    Form,
    Field,
    ErrorMessage,
    FormikValues,
    FormikTouched,
    FormikErrors,
} from "formik";

export enum InputFieldType {
    // https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input
    TEXT = "text",
    PASSWORD = "password",
    EMAIL = "email",
    URL = "url",
    DATE = "date"
}

export interface IFormFieldProps {
    fieldName: string
    label: string
    model?: any
}

export class FormInputFieldProps implements IFormFieldProps {
    constructor(
        public fieldName: string = "",
        public label: string = "",
        public type?: InputFieldType,
        public onTrailingIconSelect?: () => void
    ) {}
}

export interface IFormBaseFieldProps {
    /* formik */
    onChange: (event: any) => void
    onBlur: (event: any) => void
    values: FormikValues
    errors: FormikErrors<FormikValues>
    touched: FormikTouched<FormikValues>
}

interface IFormInputFieldProps extends FormInputFieldProps, IFormBaseFieldProps {
}

export class FormInputField extends Component<IFormInputFieldProps> {
    render() {
        return (
            <div className="FormInputField">
                <TextField
                    label={this.props.label}
                    onTrailingIconSelect={this.props.onTrailingIconSelect}
                    // trailingIcon={<MaterialIcon role="button" icon="clear" />}
                >
                    <Input
                        type={this.props.type || InputFieldType.TEXT}
                        name={this.props.fieldName}
                        inputType="input"
                        onChange={this.props.onChange}
                        onBlur={this.props.onBlur}
                        value={this.props.values[this.props.fieldName]}
                    />
                </TextField>
                <ErrorMessage name={this.props.fieldName} />
            </div>
        );
    }
}