import React, { Component } from "react";

/** Components */
// mdc react button
import "@material/react-button/dist/button.css";
import Button from "@material/react-button";
// data model
import { DataModelClass, DataModelInstance, BaseModel } from "../../store/data-model/base-model";
// formik
import {
    Formik,
    Form,
    FormikValues,
    FormikErrors,
    FormikTouched
} from "formik";
// yup
import * as Yup from 'yup';
// base field
import { FormBaseFieldMeta } from "./form-base-field/form-base-field-meta";

export enum ActionButtonType {
    SUBMIT = "submit",
    BUTTON = "button"
}

export class FormActionButtonProps {
    constructor(
        public text: string = "",
        public onClick?: (event: any) => void,
        public type?: ActionButtonType
    ) { }
}

export interface IFormFactoryProps<IDataModel> {
    onSubmitSuccess?: () => void;

    // pass in either `initialValues` or `initialInstance`, this is important for yup to render error message. If no initial info at all, yup will not display errors properly.
    // `initialValues` should be used only for customize form; for data model forms please use `initialInstance` so update & create form can be handled together
    initialValues?: any
    initialInstance?: DataModelInstance<IDataModel>;
    enforcedInstanceData?: any;

    model?: DataModelClass;
    actionButtonPropsList: Array<FormActionButtonProps>;
    formFieldPropsList: Array<FormBaseFieldMeta>
    
    validationSchema?: Yup.Schema<IDataModel>

    onSubmit?: (
        values: FormikValues,
        { setSubmitting }: { setSubmitting: Function }
    ) => void;
    
    createInstanceTriggerAction?: (
        instance: IDataModel,
        successCallback?: Function,
        finalCallback?: Function,
    ) => void;
    updateInstanceTriggerAction?: (
        instance: IDataModel,
        successCallback?: Function,
        finalCallback?: Function,
    ) => void;
}

export class FormFactory<DataModel> extends Component<
    IFormFactoryProps<DataModel>
    > {

    initialInstance?: DataModelInstance<any>;
    validationSchema?: Yup.Schema<DataModel>;

    constructor(props: IFormFactoryProps<DataModel>) {
        super(props);

        // guarantee this.initialInstance
        if (this.props.model && !this.props.initialInstance) {
            // for create form
            const model = this.props.model;
            this.initialInstance = new model({});
        }
        else {
            // for update form
            this.initialInstance = this.props.initialInstance;
        }

        // form behavior integrity check
        if (!this.initialInstance) {
            if (!this.props.initialValues || !this.props.onSubmit) {
                throw Error("ERROR: form factory has no initialInstance - seems like you're building a custom form that does not use data model. Please pass in initialValues and onSubmit in props to handle the behavior manually.");
            }
        }

        this.validationSchema = this.props.validationSchema || this.props.model.schema;
        process.env.NODE_ENV === 'development' && console.log("this.validationSchema =", this.validationSchema);
    }

    onSubmit = (
        values: FormikValues,
        { setSubmitting }: { setSubmitting: Function }
    ) => {
        process.env.NODE_ENV === 'development' && console.log("submit values =", values); setSubmitting(false);

        setSubmitting(true);
        let instanceData: any = {};
        for (let fieldProps of this.props.formFieldPropsList) {
            const keyName = fieldProps.fieldName;
            instanceData[keyName] = fieldProps.getInstance(values);
        }

        // packaging
        const model = this.props.model;
        if (
            model && this.props.createInstanceTriggerAction && this.props.updateInstanceTriggerAction &&
            this.initialInstance
        ) {
            // a create / update form is assumed

            const instance = new model({
                uuid: this.initialInstance.uuid,
                ...instanceData,
                ...this.props.enforcedInstanceData
            })
            process.env.NODE_ENV === 'development' && console.log("instanceData =", instanceData);
            process.env.NODE_ENV === 'development' && console.log("instance =", instance);

            // dispatch API request
            if (!instance.uuid) {
                process.env.NODE_ENV === 'development' && console.log("ready to send create instance");
                this.props.createInstanceTriggerAction(instance, this.props.onSubmitSuccess, () => setSubmitting(false));
            } else {
                process.env.NODE_ENV === 'development' && console.log("ready to send update instance");
                this.props.updateInstanceTriggerAction(instance, this.props.onSubmitSuccess, () => setSubmitting(false));
            }
        }
        else if (this.props.onSubmit) {
            // if caller has customize onSubmit, then use it instead
            this.props.onSubmit(values, { setSubmitting });
        }
        else {
            process.env.NODE_ENV === 'development' && console.log("this.props.initialInstance =", this.props.initialInstance);
            process.env.NODE_ENV === 'development' && console.log("this.props.onSubmit =", this.props.onSubmit);
            process.env.NODE_ENV === 'development' && console.log("this.props.model =", this.props.model);
            alert("Something is wrong with the form...!")
            throw Error("ERROR: form factory props not properly configured. See above props.")
        }
    }

    render() {
        return (
            <div className="FormFactory">
                <Formik
                    initialValues={this.initialInstance || this.props.initialValues}
                    validationSchema={this.validationSchema}
                    onSubmit={this.onSubmit}
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
                                {this.props.formFieldPropsList.map((formFieldMeta: FormBaseFieldMeta, index: number) => (
                                    <formFieldMeta.formField 
                                        key={index}
                                        {...formFieldMeta}
                                        formikValues={values}
                                    />
                                ) )}
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
