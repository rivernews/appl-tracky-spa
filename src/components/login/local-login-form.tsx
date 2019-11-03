import React from "react";

import { FormikValues } from "formik";
import { RestApiService } from "../../utils/rest-api";
import { AuthenticationService } from "../../utils/authentication";
import { FormBaseFieldMeta, InputFieldType } from "../form-factory/form-base-field/form-base-field-meta";
import { FormInputFieldMeta } from "../form-factory/form-input-field/form-input-field-meta";
import { FormActionButtonProps, ActionButtonType, FormFactory } from "../form-factory/form-factory";
// yup
import * as Yup from 'yup';

interface ILoginFormProps {
    onCancel: () => void
    onSubmit: (values: FormikValues, setSubmitting: Function) => void
}

export const LoginForm = (props: ILoginFormProps) => {

    const formFieldPropsList: Array<FormBaseFieldMeta> = [
        new FormInputFieldMeta({
            fieldName: "username",
            label: "Username",
            autoFocus: true
        }),
        new FormInputFieldMeta({
            fieldName: "password",
            label: "Password",
            type: InputFieldType.PASSWORD
        }),
    ];
    const actionButtonPropsList: Array<FormActionButtonProps> = [
        new FormActionButtonProps("Login", undefined, ActionButtonType.SUBMIT),
        new FormActionButtonProps("Cancel", props.onCancel)
    ];

    const onSubmitLoginForm = async (
        values: FormikValues,
        { setSubmitting }: { setSubmitting: Function }
    ) => {
        setSubmitting(true);
        process.env.NODE_ENV === 'development' && console.log("values =", values);

        props.onSubmit(values, setSubmitting);
    };

    // validation
    const loginFormInitialValues = {
        username: "guest",
        password: "appltracky"
    }
    type ILoginFormShape = typeof loginFormInitialValues;
    const validationSchema: Yup.Schema<ILoginFormShape> = Yup.object<ILoginFormShape>().shape({
        username: Yup.string().required("Forgot to type username...?"),
        password: Yup.string().required("Password please...!")
    })


    return (
        <div className="loginForm">
            <FormFactory
                initialValues={loginFormInitialValues}
    
                formFieldPropsList={formFieldPropsList}
                actionButtonPropsList={actionButtonPropsList}

                validationSchema={validationSchema}
    
                onSubmit={onSubmitLoginForm}
            />
        </div>
    )
}