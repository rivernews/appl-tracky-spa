import React, { Component } from "react";
import { withRouter, RouteComponentProps } from "react-router-dom";

/** Redux */
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { IRootState } from "../../store/types";
// data model
import { Link } from "../../store/data-model/link";

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

import { FormInputField, FormInputFieldProps, IFormBaseFieldProps, IFormFieldProps } from "./form-input-field";

export class FormLinkFieldProps implements IFormFieldProps {
    model = Link;
    constructor(
        public fieldName: string = "",
        public label: string = ""
    ) {
    }
}

interface IFormLinkFieldProps extends FormInputFieldProps, IFormBaseFieldProps {
}

export class FormLinkField extends Component<IFormLinkFieldProps> {

    textInputFieldProps: FormInputFieldProps;
    urlInputFieldProps: FormInputFieldProps;

    constructor(props: IFormLinkFieldProps) {
        super(props)

        this.textInputFieldProps = new FormInputFieldProps(`${this.props.fieldName}__text`, "Description");
        this.urlInputFieldProps = new FormInputFieldProps(`${this.props.fieldName}__url`, "Link url");
    }

    render() {
        return (
            <div className="FormLinkField">
                <h4>{this.props.label }</h4>
                <FormInputField 
                    {...this.textInputFieldProps} 
                    onChange={this.props.onChange}
                    onBlur={this.props.onBlur}
                    values={this.props.values}
                    errors={this.props.errors}
                    touched={this.props.touched}
                />

                <FormInputField 
                    {...this.urlInputFieldProps} 
                    onChange={this.props.onChange}
                    onBlur={this.props.onBlur}
                    values={this.props.values}
                    errors={this.props.errors}
                    touched={this.props.touched}
                />
            </div>
        );
    }
}