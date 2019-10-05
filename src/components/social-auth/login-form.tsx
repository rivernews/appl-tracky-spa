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
    registerLoginSuccess: (userName: string, apiToken: string, avatarUrl: string) => void;
    onLoginSuccess: () => void
    onCancel: () => void
}

export const LoginForm = (props: ILoginFormProps) => {

    const formFieldPropsList: Array<FormBaseFieldMeta> = [
        new FormInputFieldMeta({
            fieldName: "username",
            label: "Username"
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
        setSubmitting(false);
        process.env.NODE_ENV === 'development' && console.log("values =", values);

        try {
            // post to get login token
            const res = await fetch(`${RestApiService.state.apiBaseUrl}${AuthenticationService.state.apiLocalLoginUrl}`, {
                method: "POST",
                mode: "cors",
                credentials: "omit",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(values)
            });

            if (!res.ok) {
                process.env.NODE_ENV === 'development' && console.log("INFO: server res =", res);
                throw Error(res.statusText)
            }

            const parsedJsonResponse = await res.json();
            // set login token
            AuthenticationService.apiCallToken = parsedJsonResponse.token;
            // set redux auth store isLogin state --- have to write action and reducer.
            props.registerLoginSuccess(values.username, parsedJsonResponse.token, parsedJsonResponse.avatar_url);

            props.onLoginSuccess();
        }
        catch (err) {
            alert("Oops! Wrong username or password.");
            console.error("ERROR: login failed. See error message:");
            console.error(err);
        }
    };

    // validation
    const loginFormInitialValues = {
        username: "",
        password: ""
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