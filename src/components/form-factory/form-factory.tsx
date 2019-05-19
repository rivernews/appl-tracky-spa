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

    initialInstance?: DataModelInstance<IDataModel>;
    enforcedInstanceData?: any;
    model?: DataModelClass;
    actionButtonPropsList: Array<FormActionButtonProps>;
    formFieldPropsList: Array<FormBaseFieldMeta>

    onSubmit?: (
        values: FormikValues,
        { setSubmitting }: { setSubmitting: Function }
    ) => void;
    
    validate?: (values: FormikValues) => FormikErrors<FormikValues>;
    validationSchema?: Yup.Schema<IDataModel>;

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

    initialInstance: DataModelInstance<any>;
    validationSchema?: Yup.Schema<DataModel>;

    constructor(props: IFormFactoryProps<DataModel>) {
        super(props);

        // guarantee this.initialInstance
        if (this.props.model && !this.props.initialInstance) {
            const model = this.props.model;
            this.initialInstance = new model({});
        }
        else {
            this.initialInstance = this.props.initialInstance;
        }

        if (this.props.model) {
            this.validationSchema = this.props.model.schema;
        } else {

        }
    }

    onSubmit = (
        values: FormikValues,
        { setSubmitting }: { setSubmitting: Function }
    ) => {
        console.log("submit values =", values); setSubmitting(false);
        // setSubmitting(true);
        let instanceData: any = {};
        for (let fieldProps of this.props.formFieldPropsList) {
            const keyName = fieldProps.fieldName;
            instanceData[keyName] = fieldProps.getInstance(values);
        }

        // packaging
        const model = this.props.model;
        if (model && this.props.createInstanceTriggerAction && this.props.updateInstanceTriggerAction) {
            // a create / update form is assumed

            const instance = new model({
                uuid: this.initialInstance.uuid,
                ...instanceData,
                ...this.props.enforcedInstanceData
            })
            console.log("instanceData =", instanceData);
            console.log("instance =", instance);

            // dispatch API request
            if (!instance.uuid) {
                console.log("ready to send create data", instance);
                this.props.createInstanceTriggerAction(instance, this.props.onSubmitSuccess, () => setSubmitting(false));
            } else {
                console.log("ready to send update data", instance);
                this.props.updateInstanceTriggerAction(instance, this.props.onSubmitSuccess, () => setSubmitting(false));
            }
        }
        else if (this.props.onSubmit) {
            // if caller has customize onSubmit, then use it instead
            this.props.onSubmit(values, { setSubmitting });
        }
    }

    render() {
        return (
            <div className="FormFactory">
                <Formik
                    initialValues={this.initialInstance}
                    validate={this.props.validate}
                    validationSchema={this.props.validationSchema || this.validationSchema}
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
