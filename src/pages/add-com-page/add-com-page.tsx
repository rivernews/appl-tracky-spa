import React, { Component } from "react";

/** route */
import { withRouter, RouteComponentProps } from "react-router-dom";

/** Redux */
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { IRootState } from "../../store/types";
// REST API
import { CrudType, RequestStatus } from "../../utils/rest-api";
import {
    IObjectAction,
    IObjectStore
} from "../../store/rest-api-redux-factory";
import { CompanyActions, Company } from "../../store/data-model/company";
import { Address } from "../../store/data-model/address";
import { Link } from "../../store/data-model/link";

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
import { Formik, Form, Field } from "formik";
// form factory
import {
    FormFactory,
    FormActionButtonProps,
    IFormFactoryProps
} from "../../components/form-factory/form-factory";
import {
    FormInputFieldFactory,
    FormInputFieldProps,
    InputFieldType
} from "../../components/form-factory/form-field-factory";
import { ErrorMessage, FormikValues, FormikErrors } from "formik";
import { CompanyFormComponentContainer } from "../../components/company/company-form-component";

interface IAddComPageProps extends RouteComponentProps {
    company: IObjectStore<Company>;
}

class AddComPage extends Component<IAddComPageProps> {
    
    render() {
        return (
            <div className="AddComPage">
                <h1>AddComPage Works!</h1>
                <CompanyFormComponentContainer 
                    onSubmitSuccess={() => {
                        if (this.props.company.lastChangedObjectID) {
                            let newCompany = this.props.company.collection[
                                this.props.company.lastChangedObjectID
                            ];
                            console.log("new company:", newCompany);
                            this.props.history.push(
                                `/com-app/${newCompany.uuid}/`
                            );
                        } else {
                            console.error("store has no lastChangedObjectID");
                        }
                    }}
                    onCancel={(event) => {
                        this.props.history.push(`/`);
                    }}
                />
            </div>
        );
    }
}

const mapStateToProps = (state: IRootState) => ({
    // prop: state.prop
    company: state.company,
});

const mapDispatchToProps = (dispatch: Dispatch<IObjectAction<Company>>) => {
    // actionName = (newState for that action & its type) => dispatch(ActionCreatorFunction(newState))
    return {
    };
};

export const AddComPageContainer = withRouter(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(AddComPage)
);
