import React, { Component } from "react";

/** Components */
// mdc react icon
import MaterialIcon from "@material/react-material-icon";
// mdc react button
import "@material/react-button/dist/button.css";
// mdc-react input
import "@material/react-text-field/dist/text-field.css";
import TextField, { Input } from "@material/react-text-field";
// formik
import {
    Field, FieldProps,
    ErrorMessage,
} from "formik";
// input field
import { IFormRichTextFieldProps } from "./form-rich-text-field-meta";
// ckeditor
// import CKEditor from '@ckeditor/ckeditor5-react';
import CKEditor from '@shaungc/custom-ckeditor5-react';
// import BalloonEditor from '@ckeditor/ckeditor5-build-balloon';
import BalloonEditor from '@shaungc/ckeditor5-custom-balloon';

export class FormRichTextField extends Component<IFormRichTextFieldProps> {
    render() {
        return (
            <div className="FormRichTextField">
                <Field
                    name={this.props.fieldName}
                    render={({ field, form }: FieldProps<number | string>) => {
                        return (
                            <div className="RichTextFieldInput">
                                <div><strong>{this.props.label}</strong></div>
                                <CKEditor
                                    editor={BalloonEditor}
                                    data={field.value}
                                    onChange={(event: any, editor: any) => {
                                        form.setFieldValue(field.name, editor.getData());
                                    }}
                                    onSaveKeystroke={this.props.onSaveKeystroke}
                                />
                            </div>
                        )
                    }}
                />
                <ErrorMessage name={this.props.fieldName} />
            </div>
        );
    }
}