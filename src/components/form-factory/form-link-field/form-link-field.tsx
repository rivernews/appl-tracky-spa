// data model
import { Link } from "../../../store/data-model/link";

/** Components */
// mdc react icon
import MaterialIcon from "@material/react-material-icon";
// mdc react button
import "@material/react-button/dist/button.css";
import Button from "@material/react-button";
// mdc-react icon button
import '@material/react-icon-button/dist/icon-button.css';
import IconButton from '@material/react-icon-button';
// formik
import {
    FieldArray,
    FormikValues,
    ArrayHelpers,
} from "formik";

// link field
import { FormLinkFieldComponent, IFormLinkFieldComponentProps } from "./form-link-field-component";

interface IFormLinkFieldControlsProps {
    index: number
    formikArrayHelpers: ArrayHelpers
}

const FormLinkFieldControlls = (props: IFormLinkFieldControlsProps) => {

    const deleteField = () => {
        props.formikArrayHelpers.remove(props.index);
    }

    return (
        <div className="FormLinkFieldControls">
            <IconButton onClick={deleteField}>
                <MaterialIcon hasRipple icon="delete" />
            </IconButton>
        </div>
    )
}

const LinkFieldAddButton = (props: {
    formikArrayHelpers: ArrayHelpers
}) => {

    const onAddClick = () => {
        props.formikArrayHelpers.push({});
    }

    return (
        <Button onClick={onAddClick} children="New Link" />
    )
}

interface IFormLinkFieldProps extends IFormLinkFieldComponentProps {
    formikValues: FormikValues
    isDynamic?: boolean
    dynamicLimit?: number
}

export const FormLinkField = (props: IFormLinkFieldProps) => (
    props.isDynamic ?
        <FieldArray
            name={props.fieldName}
            render={formikArrayHelpers => (
                <div className="FormLinkFieldsContainer">
                    {props.formikValues.application_status.application_status_link.link.map((linkValue: Link, index: number) => (
                        <div key={index} className="FormLinkField">
                            <FormLinkFieldComponent
                                fieldName={`${props.fieldName}[${index}]`}
                                label={`${props.label} ${index}`}
                            />
                            <FormLinkFieldControlls
                                index={index}
                                formikArrayHelpers={formikArrayHelpers}
                            />
                        </div>
                    )
                    )}

                    <LinkFieldAddButton formikArrayHelpers={formikArrayHelpers} />
                </div>
            )}
        />
        :
        (<FormLinkFieldComponent
            fieldName={props.fieldName}
            label={props.label}
        />)
)