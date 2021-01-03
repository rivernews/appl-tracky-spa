import React, { Component } from "react";

/** Components */
// mdc react button
import "@material/react-button/dist/button.css";
// mdc-react input
import "@material/react-text-field/dist/text-field.css";
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
import Typography from "@material-ui/core/Typography";


export class FormRichTextField extends Component<IFormRichTextFieldProps> {
    render() {
        return (
            <div className="FormRichTextField">
                <Field
                    name={this.props.fieldName}
                    render={({ field, form }: FieldProps<number | string>) => {
                        return (
                            <>
                                <Typography variant="overline">{this.props.label}</Typography>
                                <CKEditor
                                    editor={BalloonEditor}
                                    data={field.value}
                                    onChange={(event: any, editor: any) => {
                                        form.setFieldValue(field.name, editor.getData());
                                    }}
                                    onSaveKeystroke={this.props.onSaveKeystroke}
                                />
                            </>
                        )
                    }}
                />
                <ErrorMessage name={this.props.fieldName} />
            </div>
        );
    }
}