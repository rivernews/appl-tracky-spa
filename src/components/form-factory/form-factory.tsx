import React, { Component } from "react";
import { withRouter, RouteComponentProps } from "react-router-dom";

/** Redux */
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { IRootState } from "../../store/types";

/** Components */
// mdc react icon
import MaterialIcon from "@material/react-material-icon";
// mdc react button
import "@material/react-button/dist/button.css";
import Button from "@material/react-button";
// mdc-react input
import "@material/react-text-field/dist/text-field.css";
import TextField, { HelperText, Input } from "@material/react-text-field";
// formik
import {
    Formik,
    Form,
    Field,
    ErrorMessage,
    FormikValues,
    FormikErrors
} from "formik";

interface IFormFactoryProps extends RouteComponentProps {}

class FormFactory extends Component<IFormFactoryProps> {
    initialValues: FormikValues = {
        position_title: "",
        job_description_page__url: "",
        job_source__url: ""
    };

    validate = (values: FormikValues): FormikErrors<FormikValues> => {
        let errors: FormikErrors<FormikValues> = {};
        if (!values.position_title) {
            errors.position_title = "Required";
        } else if (
            values.job_description_page__url !== "" &&
            !/^https*\:\/\/.+$/i.test(values.job_description_page__url)
        ) {
            errors.job_description_page__url =
                "Please start by http:// or https://";
        } else if (
            values.job_source__url !== "" &&
            !/^https*\:\/\/.+$/i.test(values.job_source__url)
        ) {
            errors.job_source__url = "Please start by http:// or https://";
        }
        return errors;
    };

    onSubmit = (
        values: FormikValues,
        { setSubmitting }: { setSubmitting: Function }
    ) => {
        setSubmitting(false);

        // prep relationship object by data model
        const job_description_page = new Link({
            url: values.job_description_page__url
        });
        const job_source = new Link({
            url: values.job_source__url
        });
        const user_company__id = this.company.uuid;

        // create main object
        const application = new Application({
            position_title: values.position_title,
            job_description_page,
            job_source,
            user_company: user_company__id
        });

        // dispatch
        this.props.createApplication(application, () => {
            if (this.props.application.lastChangedObjectID) {
                let newApplication = this.props.application.objectList[
                    this.props.application.lastChangedObjectID
                ];
                console.log("new application:", newApplication);
            } else {
                console.error("application store has no lastChangedObjectID");
            }
        });
    };

    render() {
        return (
            <div className="FormFactory">
                <h1>FormFactory Works!</h1>
                <Formik
                    initialValues={this.initialValues}
                    validate={this.validate}
                    onSubmit={this.onSubmit}
                >
                    {({
                        values,
                        errors,
                        touched,
                        handleChange,
                        handleBlur,
                        handleSubmit,
                        isSubmitting
                    }) => (
                        <Form>
                            {/* Position Title */}
                            <TextField
                                label="Position Title"
                                onTrailingIconSelect={() => {
                                    values.position_title = "";
                                    touched.position_title = false;
                                }}
                                trailingIcon={
                                    <MaterialIcon role="button" icon="clear" />
                                }
                            >
                                <Input
                                    name="position_title"
                                    inputType="input"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.position_title}
                                />
                            </TextField>
                            {errors.position_title &&
                                touched.position_title &&
                                errors.position_title}

                            <br />

                            {/* Job Description Page URL */}
                            <TextField
                                label="Job Description Page URL"
                                onTrailingIconSelect={() => {
                                    values.job_description_page__url = "";
                                    touched.job_description_page__url = false;
                                }}
                                trailingIcon={
                                    <MaterialIcon role="button" icon="clear" />
                                }
                            >
                                <Input
                                    name="job_description_page__url"
                                    inputType="input"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.job_description_page__url}
                                />
                            </TextField>
                            {errors.job_description_page__url &&
                                touched.job_description_page__url &&
                                errors.job_description_page__url}

                            <br />

                            {/* Job Source URL */}
                            <TextField
                                label="Job Source URL"
                                onTrailingIconSelect={() => {
                                    values.job_source__url = "";
                                    touched.job_source__url = false;
                                }}
                                trailingIcon={
                                    <MaterialIcon role="button" icon="clear" />
                                }
                            >
                                <Input
                                    name="job_source__url"
                                    inputType="input"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.job_source__url}
                                />
                            </TextField>
                            {errors.job_source__url &&
                                touched.job_source__url &&
                                errors.job_source__url}

                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                unelevated
                                children="Create"
                            />

                            <Button
                                onClick={clickEvent => {
                                    this.setState({
                                        isApplicationFormOpened: false
                                    });
                                }}
                                unelevated
                                children="Cancel"
                            />
                        </Form>
                    )}
                </Formik>
            </div>
        );
    }
}

const mapStateToProps = (store: IRootState) => ({
    // prop: store.prop
});

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
    // actionName: (newState for that action & its type) => dispatch(ActionCreatorFunction(newState))
    return {};
};

export const FormFactoryContainer = withRouter(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(FormFactory)
);
