import React, { Component } from "react";

/** Components */
// mdc react button
import "@material/react-button/dist/button.css";
import Button from "@material/react-button";
// formik
import {
    Formik,
    Form,
    FormikValues,
    FormikErrors,
    FormikTouched
} from "formik";
import { FormInputField } from "./form-input-field/form-input-field";
import { FormInputFieldMeta } from "./form-input-field/form-input-field-meta";
import { IFormBaseFieldProps } from "./form-base-field/form-base-field-meta";
// form fields
import { FormLinkField } from "./form-link-field/form-link-field";
import { FormLinkFieldMeta } from "./form-link-field/form-link-field-meta";

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
    formInputFieldPropsList: Array<FormInputFieldMeta>
}

export class FormFactory<DataModel> extends Component<
    IFormFactoryProps<DataModel>
> {

    onSubmit() {

    }

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
                        isSubmitting
                    }: {
                        values: FormikValues,
                        touched: FormikTouched<FormikValues>,
                        [props: string]: any
                    }) => (
                        <Form>
                            {this.props.formInputFieldPropsList.map((formFieldProps: IFormBaseFieldProps, index) => {
                                if (!formFieldProps.model) {
                                    return (
                                        <FormInputField 
                                            key={index}
                                            {...formFieldProps} 
                                        />
                                    )
                                }
                                else {
                                    if (formFieldProps instanceof FormLinkFieldMeta) {
                                        return (
                                            <FormLinkField
                                                key={index}
                                                {...formFieldProps}
                                                formikValues={values}
                                                isDynamic={formFieldProps.isDyanmic}
                                            />
                                        )
                                    }
                                }
                            })}
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
