import React from "react";

import { FormikValues } from "formik";
import { RestApiService } from "../../utils/rest-api";
import { AuthenticationService } from "../../utils/auth";
import { FormBaseFieldMeta, InputFieldType } from "../form-factory/form-base-field/form-base-field-meta";
import { FormInputFieldMeta } from "../form-factory/form-input-field/form-input-field-meta";
import { FormActionButtonProps, ActionButtonType, FormFactory } from "../form-factory/form-factory";

interface ILoginFormProps {
    registerLoginSuccess: (userName: string, apiToken: string, avatarUrl: string) => void;
    onLoginSuccess: () => void
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
        new FormActionButtonProps("Login", undefined, ActionButtonType.SUBMIT)
    ];

    const onSubmitLoginForm = async (
        values: FormikValues,
        { setSubmitting }: { setSubmitting: Function }
    ) => {
        setSubmitting(false);
        console.log("values =", values);

        try {
            // post to get login token
            const res = await fetch(`${RestApiService.state.apiBaseUrl}api-token-auth/`, {
                method: "POST",
                mode: "cors",
                credentials: "omit",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(values)
            });

            if (!res.ok) {
                console.log("INFO: server res =", res);
                throw Error(res.statusText)
            }

            const parsedJsonResponse = await res.json();
            // set login token
            AuthenticationService.state.apiLoginToken = parsedJsonResponse.token;
            // set redux auth store isLogin state --- have to write action and reducer.
            props.registerLoginSuccess(values.username, parsedJsonResponse.token, parsedJsonResponse.avatar_url);

            props.onLoginSuccess();
        }
        catch (err) {
            alert("Oops! Login failed.");
            console.error("ERROR: login failed. See error message:");
            console.error(err);
        }
    };

    return (
        <div className="loginForm">
            <FormFactory
    
                formFieldPropsList={formFieldPropsList}
                actionButtonPropsList={actionButtonPropsList}
    
                onSubmit={onSubmitLoginForm}
            />
        </div>
    )
}