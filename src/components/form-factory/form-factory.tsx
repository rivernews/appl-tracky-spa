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
    FormikErrors,
    FormikTouched
} from "formik";
import { FormInputFieldFactory, FormInputFieldProps } from "./form-field-factory";

export enum ActionButtonType {
    SUBMIT = "submit",
    BUTTON = "button"
}

export class FormActionButtonProps {
    constructor(
        public text: string = "", 
        public onClick?: (event: any) => void, 
        public type?: ActionButtonType
    ) {}
}

export interface IFormFactoryProps<DataModel> {
    initialValues: DataModel;

    validate: (values: FormikValues) => FormikErrors<FormikValues>;
    onSubmit: (
        values: FormikValues,
        { setSubmitting }: { setSubmitting: Function }
    ) => void;

    actionButtonPropsList: Array<FormActionButtonProps>;
    formInputFieldPropsList: Array<FormInputFieldProps>
}

export class FormFactory<DataModel> extends Component<
    IFormFactoryProps<DataModel>
> {
    render() {
        return (
            <div className="FormFactory">
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
                    }: {
                        values: FormikValues,
                        touched: FormikTouched<FormikValues>,
                        [props: string]: any
                    }) => (
                        <Form>
                            {this.props.formInputFieldPropsList.map((formInputFieldProps: FormInputFieldProps, index) => (
                                <FormInputFieldFactory 
                                    key={index}
                                    {...formInputFieldProps} 
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    values={values}
                                    errors={errors}
                                    touched={touched}
                                />
                            ))}
                            {this.props.actionButtonPropsList.map(
                                (actionButtonProps: FormActionButtonProps, index) => (
                                    <Button
                                        key={index}
                                        type={actionButtonProps.type || ActionButtonType.BUTTON}
                                        disabled={isSubmitting}
                                        unelevated
                                        onClick={actionButtonProps.onClick}
                                        children={actionButtonProps.text}
                                    />
                                )
                            )}
                        </Form>
                    )}
                </Formik>
            </div>
        );
    }
}
