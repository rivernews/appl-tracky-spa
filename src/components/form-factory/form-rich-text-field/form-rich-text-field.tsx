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
import { RestApiService } from "../../../utils/rest-api";
import { AuthenticationService } from "../../../utils/authentication";


const onEditorReady = (editor: any) => {
    editor.plugins.get('FileRepository').createUploadAdapter = (loader: any) => {
        return new MyUploadAdapter(loader);
    };
}

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
                                    onInit={onEditorReady}
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

class MyUploadAdapter {
    // Based on CKEditor official doc
    // https://ckeditor.com/docs/ckeditor5/latest/framework/guides/deep-dive/upload-adapter.html

    loader: any;
    xhr?: XMLHttpRequest;

    constructor( loader: any ) {
        // The file loader instance to use during the upload.
        this.loader = loader;
    }

    // Starts the upload process.
    upload() {
        return this.loader.file
            .then( (file: any) => new Promise( ( resolve, reject ) => {
                if (process.env.NODE_ENV === 'development') {
                    return reject('Upload image in development mode is not allowed!');
                }

                /** Check file size limit to 1M */
                // const fileSizeMB = file.size/1024/1024;
                // if (fileSizeMB > 1.0) {
                //     const errorMessage = `🛑 File size limit is 1MB, but file size too large: ${+fileSizeMB.toFixed(3)}MB.`;
                //     console.error(errorMessage);
                //     // reject will already trigger `alert`, which is the behavior of the ckeditor uploader; so we will not make another `popUpMessage`
                //     return reject(errorMessage);
                // }

                this._initRequest();
                this._initListeners( resolve, reject, file );
                this._sendRequest( file );
            } ) );
    }

    // Aborts the upload process.
    abort() {
        if ( this.xhr ) {
            this.xhr.abort();
            console.warn('CKEditor file upload aborted');
        }
    }

    // Initializes the XMLHttpRequest object using the URL passed to the constructor.
    _initRequest() {
        const xhr = this.xhr = new XMLHttpRequest();

        // Note that your request may look different. It is up to you and your editor
        // integration to choose the right communication channel. This example uses
        // a POST request with JSON as a data structure but your configuration
        // could be different.
        const url = RestApiService.getRelativeUrl({ endpointUrl: 'private-image/' });
        xhr.open( 'POST', url, true );
        xhr.responseType = 'json';
    }

    // Initializes XMLHttpRequest listeners.
    _initListeners( resolve: Function, reject: Function, file: any ) {
        const xhr = this.xhr as XMLHttpRequest;
        const loader = this.loader;
        const genericErrorText = `Couldn't upload file: ${ file.name }.`;

        xhr.addEventListener( 'error', () => reject( genericErrorText ) );
        xhr.addEventListener( 'abort', () => reject() );
        xhr.addEventListener( 'load', () => {
            const response = xhr.response;

            // This example assumes the XHR server's "response" object will come with
            // an "error" which has its own "message" that can be passed to reject()
            // in the upload promise.
            //
            // Your integration may handle upload errors in a different way so make sure
            // it is done properly. The reject() function must be called when the upload fails.
            if ( !response || response.error || xhr.status !== 200 ) {
                return reject( response && response.error ? response.error.message : genericErrorText );
            }

            // If the upload is successful, resolve the upload promise with an object containing
            // at least the "default" URL, pointing to the image on the server.
            // This URL will be used to display the image in the content. Learn more in the
            // UploadAdapter#upload documentation.
            resolve( {
                default: response.image_url,
                // '1052': 'https://path/to/image.png'
            } );
        } );

        // Upload progress when it is supported. The file loader has the #uploadTotal and #uploaded
        // properties which are used e.g. to display the upload progress bar in the editor
        // user interface.
        if ( xhr.upload ) {
            xhr.upload.addEventListener( 'progress', evt => {
                if ( evt.lengthComputable ) {
                    loader.uploadTotal = evt.total;
                    loader.uploaded = evt.loaded;
                }
            } );
        }
    }

    // Prepares the data and sends the request.
    _sendRequest( file: any ) {
        const xhr = this.xhr as XMLHttpRequest;

        // Prepare the form data.
        const data = new FormData();

        data.append( 'file', file );

        // Important note: This is the right place to implement security mechanisms
        // like authentication and CSRF protection. For instance, you can use
        // XMLHttpRequest.setRequestHeader() to set the request headers containing
        // the CSRF token generated earlier by your application.
        xhr.withCredentials = true;
        xhr.setRequestHeader('Authorization', `JWT ${AuthenticationService.apiCallToken}`);
        // xhr.setRequestHeader('X-CSRFTOKEN', '')

        // Send the request.
        xhr.send( data );
    }
}
