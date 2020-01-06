import React from "react";

/** Components */
// mdc react icon
import MaterialIcon from "@material/react-material-icon";
// mdc react button
import "@material/react-button/dist/button.css";
import Button from "@material/react-button";
// mdc-react icon button
import '@material/react-icon-button/dist/icon-button.css';
import IconButton from '@material/react-icon-button';
// data model
import { DataModelClass } from "../../../data-model/base-model";
// formik
import {
    FieldArray,
    ArrayHelpers,
} from "formik";
// base field
import { IFormBaseFieldProps } from "./form-base-field-meta";


interface IFormBaseDyanmicFieldControllsProps {
    index: number
    formikArrayHelpers: ArrayHelpers
}

const FormBaseDynamicFieldControlls = (props: IFormBaseDyanmicFieldControllsProps) => {

    const deleteField = () => {
        confirm(`Are you sure you want to delete this dynamic field?`) && props.formikArrayHelpers.remove(props.index);
    }

    return (
        <div className="FormBaseDynamicFieldControlls">
            <IconButton type="button" onClick={deleteField}>
                <MaterialIcon hasRipple icon="delete" />
            </IconButton>
        </div>
    )
}

const BaseDynamicFieldAddButton = (props: {
    formikArrayHelpers: ArrayHelpers
    model?: DataModelClass
    label: string
}) => {

    const onAddClick = () => {
        if (props.model) {
            const model = props.model;
            props.formikArrayHelpers.push(new model({}));
        } else {
            props.formikArrayHelpers.push({});
        }
    }

    return (
        <Button type="button" onClick={onAddClick} children={`New ${props.label}`} />
    )
}

export const withFormBaseField = (FormFieldComponent: React.ComponentType<IFormBaseFieldProps>) => (props: IFormBaseFieldProps) => {

    if (props.isDynamic && !props.formikValues) {
        alert("Oops! Something's wrong.");
        throw Error("When `isDynamic` is true, you need to pass over `formikValues`.");
    }

    const formikValues = props.formikValues;
    const getInstanceDataFromFormikValues = props.getInstanceDataFromFormikValues;

    return (
        (props.isDynamic && getInstanceDataFromFormikValues && formikValues) ?
            (<FieldArray
                name={props.fieldName}
                render={formikArrayHelpers => (
                    <div className="FormApplicationStatusLinkFieldsContainer">
                        {getInstanceDataFromFormikValues(formikValues).map((instanceData: any, index: number) => (
                            <div key={index} className="FormBaseDynamicField">
                                <FormFieldComponent
                                    fieldName={`${props.fieldName}[${index}]`}
                                    label={`${props.label} ${index}`}
                                    formikValues={props.formikValues}
                                    getInstanceDataFromFormikValues={props.getInstanceDataFromFormikValues}
                                />
                                <FormBaseDynamicFieldControlls
                                    index={index}
                                    formikArrayHelpers={formikArrayHelpers}
                                />
                            </div>
                        ))}

                        <BaseDynamicFieldAddButton
                            formikArrayHelpers={formikArrayHelpers}
                            label={props.label}
                            model={props.model}
                        />
                    </div>
                )}
            />)
            :
            (<FormFieldComponent
                fieldName={props.fieldName}
                label={props.label}
                formikValues={props.formikValues}
                getInstanceDataFromFormikValues={props.getInstanceDataFromFormikValues}
            />)
    )
}
