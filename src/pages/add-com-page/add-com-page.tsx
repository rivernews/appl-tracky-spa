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
import "./add-com-page.css"

//mdc-react icon
import MaterialIcon from "@material/react-material-icon";
// mdc-react button
import "@material/react-button/dist/button.css";
import Button from "@material/react-button";
// mdc-react input
import "@material/react-text-field/dist/text-field.css";
import TextField, { HelperText, Input } from "@material/react-text-field";
import { CompanyFormComponentContainer } from "../../components/company/company-form-component";

interface IAddComPageParams {
    uuid?: string;
}

interface IAddComPageProps extends RouteComponentProps<IAddComPageParams> {
    company: IObjectStore<Company>;
}

class AddComPage extends Component<IAddComPageProps> {
    render() {
        const company: Company | undefined = (this.props.match.params.uuid && this.props.company.collection[this.props.match.params.uuid])
            ? this.props.company.collection[this.props.match.params.uuid]
            : undefined;
        process.env.NODE_ENV === 'development' && console.log(
            "com form page: params is",
            this.props.match.params.uuid,
            "company is",
            company
        );
        return (
            <div className="AddComPage">
                <h1>{!company ? "Add a Company" : `Update Company`}</h1>
                <CompanyFormComponentContainer
                    company={company}
                    onSubmitSuccess={() => {
                        process.env.NODE_ENV === 'development' && console.log("com form page: onSubmitSuccess");
                        
                        if (this.props.company.lastChangedObjectID) {
                            let newCompany = this.props.company.collection[
                                this.props.company.lastChangedObjectID
                            ];
                            process.env.NODE_ENV === 'development' && console.log("new company:", newCompany);

                            company ? (
                                // case: update company, let user be able to go back to update form
                                this.props.history.push(`/com-app/${newCompany.uuid}/`)
                            ) : (
                                // case: create company, don't let user go back to form. If attempt to update company, user should click on edit; if attempt to create another company, should go to /home/ to do so
                                this.props.history.replace(`/com-app/${newCompany.uuid}/`)
                            );
                        } else {
                            console.error("store has no lastChangedObjectID");
                        }
                    }}
                    onCancel={event => {
                        this.props.history.goBack()
                    }}
                />
            </div>
        );
    }
}

const mapStateToProps = (state: IRootState) => ({
    // prop: state.prop
    company: state.company
});

const mapDispatchToProps = (dispatch: Dispatch<IObjectAction<Company>>) => {
    // actionName = (newState for that action & its type) => dispatch(ActionCreatorFunction(newState))
    return {};
};

export const AddComPageContainer = withRouter(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(AddComPage)
);
