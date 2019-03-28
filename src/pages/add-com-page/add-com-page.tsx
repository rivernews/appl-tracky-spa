import React, { Component } from "react";
import { withRouter, RouteComponentProps } from "react-router-dom";

/** Redux */
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { IRootState } from "../../store/types";
// REST API
import { CrudType, RequestStatus } from "../../utils/rest-api";
import { IObjectAction } from "../../store/rest-api-redux-factory";
import { companyActions, Company } from "../../store/company/company";
import { addressActions, Address } from "../../store/address/address";

/** Components */
//mdc-react icon
import MaterialIcon from "@material/react-material-icon";
// mdc-react button
import "@material/react-button/dist/button.css";
import Button from "@material/react-button";
// mdc-react input
import "@material/react-text-field/dist/text-field.css";
import TextField, { HelperText, Input } from "@material/react-text-field";
// formik
import { Formik, Form, Field, ErrorMessage } from "formik";

interface IAddComPageProps extends RouteComponentProps {
    createCompany: (companyFormData: Company) => void;
    createAddress: (addressFormData: Address) => void;
}

class AddComPage extends Component<IAddComPageProps> {
    render() {
        return (
            <div className="AddComPage">
                <h1>AddComPage Works!</h1>
                <Formik
                    initialValues={{
                        companyName: "",
                        companyHomePageURL: "",
                        companyFullAddress: ""
                    }}
                    validate={values => {
                        let errors: any = {};
                        if (!values.companyName) {
                            errors.companyName = "Required";
                        }
                        return errors;
                    }}
                    onSubmit={(values, { setSubmitting }) => {
                        setTimeout(() => {
                            alert(JSON.stringify(values, null, 2));
                            setSubmitting(false);

                            // this.props.createCompany(
                            //     new Company(
                            //         values.companyName,
                            //         values.companyHomePageURL
                            //     )
                            // );
                            this.props.createAddress(
                                new Address(
                                    "", values.companyFullAddress
                                )
                            )
                            // this.props.history.push(
                            //     "/com-app/erwrwr-123421-adfdf/"
                            // );
                        }, 1000);
                    }}
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
                        <form onSubmit={handleSubmit}>
                        {/* Company Name */}
                            <TextField
                                label="Company Name"
                                onTrailingIconSelect={() => {
                                    values.companyName = "";
                                    touched.companyName = false;
                                }}
                                trailingIcon={
                                    <MaterialIcon role="button" icon="clear" />
                                }
                            >
                                <Input
                                    id="companyName"
                                    inputType="input"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.companyName}
                                />
                            </TextField>
                            {errors.companyName &&
                                touched.companyName &&
                                errors.companyName}

                            <br />

                                {/* Company Website URL */}
                            <TextField
                                label="Company HomePage URL"
                                onTrailingIconSelect={() => {
                                    values.companyHomePageURL = "";
                                    touched.companyHomePageURL = false;
                                }}
                                trailingIcon={
                                    <MaterialIcon role="button" icon="clear" />
                                }
                            >
                                <Input
                                    id="companyHomePageURL"
                                    inputType="input"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.companyHomePageURL}
                                />
                            </TextField>
                            {errors.companyHomePageURL &&
                                touched.companyHomePageURL &&
                                errors.companyHomePageURL}

                            <br />

                                {/* Company Address */}
                            <TextField
                                label="Company Full Address"
                                onTrailingIconSelect={() => {
                                    values.companyFullAddress = "";
                                    touched.companyFullAddress = false;
                                }}
                                trailingIcon={
                                    <MaterialIcon role="button" icon="clear" />
                                }
                            >
                                <Input
                                    id="companyFullAddress"
                                    inputType="input"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.companyFullAddress}
                                />
                            </TextField>
                            {errors.companyFullAddress &&
                                touched.companyFullAddress &&
                                errors.companyFullAddress}

                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                unelevated
                                children="Create"
                            />
                        </form>
                    )}
                </Formik>
            </div>
        );
    }
}

const mapStateToProps = (state: IRootState) => ({
    // prop: state.prop
});

const mapDispatchToProps = (dispatch: Dispatch<IObjectAction<Company>>) => {
    // actionName = (newState for that action & its type) => dispatch(ActionCreatorFunction(newState))
    return {
        createCompany: (companyFormData: Company) =>
            dispatch(
                companyActions[CrudType.CREATE][RequestStatus.TRIGGERED].action(
                    companyFormData
                )
            ),
        createAddress: (addressFormData: Address) =>
            dispatch(
                addressActions[CrudType.CREATE][RequestStatus.TRIGGERED].action(
                    addressFormData
                )
            )
    };
};

export const AddComPageContainer = withRouter(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(AddComPage)
);
