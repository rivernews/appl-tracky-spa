import React, { Component } from "react";
import { withRouter, RouteComponentProps } from "react-router-dom";

import { Utilities } from "../../utils/utilities";

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

import { TabContainer } from "../../components/tab/tab-container";
import { TabContent } from "../../components/tab/tab-content";

// objects
// import { CompanyApplicationComponentContainer } from "../../components/company-application/company-application-component";
import { CompanyListItem } from "../../components/company/company-list-item";
import { RequestStatus } from "../../utils/rest-api";

import {
    Body1,
    Body2,
    // Button,
    Caption,
    Headline1,
    Headline2,
    Headline3,
    Headline4,
    Headline5,
    Headline6,
    Overline,
    Subtitle1,
    Subtitle2,
} from '@material/react-typography';
import '@material/react-typography/dist/typography.css';

// styling
import styles from "./user-app-page.module.css";


interface IUserAppPageProps extends RouteComponentProps {
    company: IObjectStore<Company>
    application: IObjectStore<Application>
}

interface IUserAppPageState {
    searchText: string
    isFiltering: boolean
    filteredCompanyList: Array<Company>
    activeTabIndex: number
}

class UserAppPage extends Component<IUserAppPageProps, IUserAppPageState> {
    state = {
        searchText: '',
        isFiltering: false,
        filteredCompanyList: [],
        activeTabIndex: 0
    };

    onCompanyClick = (uuid: string) => {
        setTimeout(() => this.props.history.push(`/com-app/${uuid}/`), 10);
    }

    searchFieldTextIsEmpty = () => {
        return Utilities.normalizeText(this.state.searchText) === '';
    }

    filterCompanyByName = (name: string) => {
        const filteringName = Utilities.normalizeText(name);
        const allCompanies = Object.values(this.props.company.collection);

        this.setState({
            filteredCompanyList: allCompanies.filter((company: Company) => Utilities.normalizeText(company.name).includes(filteringName)),

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
        this.setState({ searchText: '', isFiltering: false });
    }

    handleActiveTabIndexUpdate = (activeTabIndex: number) => this.setState({ activeTabIndex });

    render() {
        const allCompanies = Object.values(this.props.company.collection);
        const displayingCompanies = this.props.company.requestStatus !== RequestStatus.REQUESTING ? this.state.isFiltering ? this.state.filteredCompanyList : allCompanies : Array.from(Array(5));

        return (
            <>
                <div className={styles.UserAppPageHeader}>
                    <Headline3>Your Organizations</Headline3>
                    <Button
                        className="mdc-theme-secondary"
                        onClick={() => { this.props.history.push("/com-form/") }}
                        unelevated
                        icon={<MaterialIcon hasRipple icon="add" />}
                        children="Add Organization"
                    />
                </div>
                <TabContainer>
                    <TabContent label="Real stuff">
                        <div className={styles.companyListHeader}>
                            <h1>Actively Applying</h1>
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
                        <div>
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
                    </TabContent>
                    <TabContent label="Two Test Test">
                        <div className={styles.companyListHeader}>
                            <h1>Another Tab</h1>
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
                        <div>
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
                    </TabContent>
                    <TabContent label="Three test">
                        <div className={styles.companyListHeader}>
                            <h1>Love it!</h1>
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
                        <div>
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
                    </TabContent>
                </TabContainer>
            </>
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
