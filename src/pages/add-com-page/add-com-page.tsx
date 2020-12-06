import React, { Component } from "react";

/** route */
import { withRouter, RouteComponentProps } from "react-router-dom";

/** Redux */
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { IRootState } from "../../state-management/types/root-types";
// REST API
import { ISingleRestApiResponse } from "../../utils/rest-api";
import {
    IObjectAction,
    IObjectStore
} from "../../state-management/types/factory-types";
import { Company } from "../../data-model/company/company";

/** Components */
import "./add-com-page.css"
// mdc-react button
import "@material/react-button/dist/button.css";
// mdc-react input
import "@material/react-text-field/dist/text-field.css";
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
        return (
            <div className="AddComPage">
                <h1>{!company ? "Add an Organization" : `Update Organization`}</h1>
                <CompanyFormComponentContainer
                    company={company}
                    onSubmitSuccess={(jsonResponse) => {
                        const uuid = (jsonResponse as ISingleRestApiResponse<Company>).uuid;

                        company ? (
                            // case: update company, let user be able to go back to update form
                            this.props.history.push(`/com-app/${uuid}/`)
                        ) : (
                            // case: create company, don't let user go back to form. If attempt to update company, user should click on edit; if attempt to create another company, should go to /home/ to do so
                            this.props.history.replace(`/com-app/${uuid}/`)
                        );
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
