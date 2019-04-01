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
    FormikErrors
} from "formik";
import { IFormField, FormFieldFactory } from "./form-field-factory";

interface IFormFactoryProps<DataModel> {
    initialValues: DataModel;

    validate: (values: FormikValues) => FormikErrors<FormikValues>;
    onSubmit: (
        values: FormikValues,
        { setSubmitting }: { setSubmitting: Function }
    ) => void;

    actionButtons: Array<IFormActionButton>;
    formFields: Array<IFormField>
}

interface IFormActionButton {
    type?: string;
    onClick?: () => void;
    text: string;
}

export class FormFactory<DataModel> extends Component<
    IFormFactoryProps<DataModel>
> {
    render() {
        return (
            <div className="FormFactory">
                <h1>FormFactory Works!</h1>
                <Formik
                    initialValues={this.props.initialValues}
                    validate={this.props.validate}
                    onSubmit={this.props.onSubmit}
                >
                    {({
                        values,
                        errors,
                        touched,
                        handleChange,
                        handleBlur,
                        handleSubmit,
                        isSubmitting
                    }) => {
                        <Form>
                            {this.props.formFields.map((formField) => (
                                <FormFieldFactory 
                                    {...formField} 
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    values={values}
                                    errors={errors}
                                    touched={touched}
                                />
                            ))}
                            {this.props.actionButtons.map(
                                (actionButton: IFormActionButton) => (
                                    <Button
                                        type={actionButton.type}
                                        disabled={isSubmitting}
                                        unelevated
                                        onClick={actionButton.onClick}
                                        children={actionButton.text}
                                    />
                                )
                            )}
                        </Form>;
                    }}
                </Formik>
            </div>
        );
    }
}
