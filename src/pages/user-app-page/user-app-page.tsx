import React, { Component } from "react";
import { withRouter, RouteComponentProps } from "react-router-dom";

/** Redux */
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { IRootState } from "../../store/types";
import { IObjectAction, IObjectStore } from "../../store/rest-api-redux-factory";
import { InputFieldType } from "../../components/form-factory/form-base-field/form-base-field-meta";
// data models
import { Company } from "../../store/data-model/company";
import { Application } from "../../store/data-model/application";

/** Components */
// mdc react icon
import MaterialIcon from "@material/react-material-icon";
// mdc react button
import "@material/react-button/dist/button.css";
import Button from "@material/react-button";

// mdc-react input
import "@material/react-text-field/dist/text-field.css";
import TextField, { Input } from "@material/react-text-field";

// objects
// import { CompanyApplicationComponentContainer } from "../../components/company-application/company-application-component";
import { CompanyListItem } from "../../components/company/company-list-item";
import { RequestStatus } from "../../utils/rest-api";

// styling
import "./user-app-page.css";
import styles from "./user-app-page.module.css";


interface IUserAppPageProps extends RouteComponentProps {
    company: IObjectStore<Company>
    application: IObjectStore<Application>
}

interface IUserAppPageState {
    searchText: string
    isFiltering: boolean
    filteredCompanyList: Array<Company>
}

class UserAppPage extends Component<IUserAppPageProps, IUserAppPageState> {
    state = {
        searchText: '',
        isFiltering: false,
        filteredCompanyList: []
    };

    onCompanyClick = (uuid: string) => {
        setTimeout(() => this.props.history.push(`/com-app/${uuid}/`), 10);
    }

    searchFieldTextIsEmpty = () => {
        return this.state.searchText.trim() === '';
    }

    filterCompanyByName = (name: string) => {
        const allCompanies = Object.values(this.props.company.collection);

        this.setState({
            filteredCompanyList: allCompanies.filter((company: Company) => company.name.toLowerCase().includes(name)),

            // always switch on filering mode when filtering is triggered
            isFiltering: true
        })
    }

    onSearchFieldChange = (event: React.FormEvent<HTMLInputElement>) => {
        this.setState({
            searchText: event.currentTarget.value,
        }, () => {
            this.setState({
                // switch off filtering mode if field becomes empty
                isFiltering: this.searchFieldTextIsEmpty() ? false : this.state.isFiltering
            })
        });
    }

    onSearchFieldKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key.toLowerCase() === 'enter') {
            !this.searchFieldTextIsEmpty() && this.filterCompanyByName(this.state.searchText);
        }
    }

    onSearchFieldClear = () => {
        this.setState({searchText: '', isFiltering: false});
    }

    render() {
        const allCompanies = Object.values(this.props.company.collection);
        const displayingCompanies = this.props.company.requestStatus !== RequestStatus.REQUESTING ? this.state.isFiltering ? this.state.filteredCompanyList : allCompanies : Array.from(Array(5));

        return (
            <div className="UserAppPage">
                <div className={styles.userAppPageHeader}>
                    <h1>Companies You Apply</h1>
                    <Button
                        onClick={() => { this.props.history.push("/com-form/") }}
                        unelevated
                        icon={<MaterialIcon hasRipple icon="add" />}
                        children="Add Company"
                    />
                    <TextField
                        className={styles.searchField}
                        label="Search Company Name"
                        outlined
                        leadingIcon={<MaterialIcon role="button" icon="search" />}
                        trailingIcon={this.state.searchText === '' ? undefined : <MaterialIcon role="button" icon="clear" />}
                        onTrailingIconSelect={this.onSearchFieldClear}
                    >
                        <Input
                            type={InputFieldType.TEXT}
                            inputType="input"
                            onKeyDown={this.onSearchFieldKeyDown}
                            onChange={this.onSearchFieldChange}
                            value={this.state.searchText}
                        />
                    </TextField>
                </div>
                <div className={styles.userAppPageContent}>
                    {
                        displayingCompanies.map(
                            (company, index) => 
                            <CompanyListItem 
                                key={company ? company.uuid : index}
                                company={company}
                                applications={company ? Object.values(this.props.application.collection).filter((application) => application.user_company === company.uuid) : undefined}
                                onClick={company ? this.onCompanyClick : undefined}
                            />
                        )
                    }
                </div>
            </div>
        )
    }
}

const mapStateToProps = (store: IRootState) => ({
    // prop: store.prop
    company: store.company,
    application: store.application,
});

const mapDispatchToProps = (dispatch: Dispatch<IObjectAction<{}>>) => {
    // actionName = (newState for that action & its type) => dispatch(ActionCreatorFunction(newState))

    return {
        // listObject: (callback?: Function) =>
        //     dispatch(
        //         ObjectActions[CrudType.LIST][RequestStatus.TRIGGERED].action(
        //             new Object({}),
        //             callback
        //         )
        //     ),
    }
};

export const UserAppPageContainer = withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(UserAppPage));
