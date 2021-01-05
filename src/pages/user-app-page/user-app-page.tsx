import React, { Component, useCallback, useEffect, useState } from "react";
import { withRouter, RouteComponentProps } from "react-router-dom";

import { Utilities } from "../../utils/utilities";

/** Redux */
import { connect, useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import { IRootState } from "../../state-management/types/root-types";
import { IObjectAction, IObjectStore } from "../../state-management/types/factory-types";
import { InputFieldType } from "../../components/form-factory/form-base-field/form-base-field-meta";
// data models
import { Company, labelTypesMapToCompanyGroupTypes, companyGroupTypes } from "../../data-model/company/company";
import { labelTypes } from "../../data-model/label";
import { Application } from "../../data-model/application/application";

/** Components */
// mdc react icon
import MaterialIcon from "@material/react-material-icon";
// mdc react button
import MaterialUIList from "@material-ui/core/List";
import Button from '@material-ui/core/Button';

// mdc-react input
import "@material/react-text-field/dist/text-field.css";
import TextField, { Input } from "@material/react-text-field";

import { TabContainer } from "../../components/tab/tab-container";
import { TabContent } from "../../components/tab/tab-content";

// objects
import { CompanyListItem } from "../../components/company/company-list-item";
import { CrudType, RequestStatus } from "../../utils/rest-api";

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
import { IReference } from "../../data-model/base-model";
import { GroupedCompanyActionCreators } from "../../state-management/action-creators/root-actions";
import { createStyles, makeStyles } from "@material-ui/core";


const useStyles = makeStyles(() => {
    return createStyles({
        loadMoreButtonContainer: {
            display: 'flex',
            justifyContent: 'center',
            margin: '5vh 0 10vh 0'
        }
    })
})


interface IUserAppPageProps extends RouteComponentProps {
    company: IObjectStore<Company>
    targetCompany: IObjectStore<Company>
    appliedCompany: IObjectStore<Company>
    interviewingCompany: IObjectStore<Company>
    archivedCompany: IObjectStore<Company>

    application: IObjectStore<Application>
}

interface ILoadMoreButtonProps {
    labelText: labelTypes
}

const LoadMoreButton = ({ labelText }: ILoadMoreButtonProps) => {
    const { graphqlEndCursor: endCursor, requestStatus } = useSelector((state: IRootState) => {
        return state[labelTypesMapToCompanyGroupTypes[labelText as labelTypes]];
    })
    const dispatch = useDispatch();
    const onClick = useCallback(() => {
        dispatch(
            GroupedCompanyActionCreators[labelTypesMapToCompanyGroupTypes[labelText as labelTypes]][CrudType.LIST][RequestStatus.TRIGGERED].action({
                graphqlFunctionName: 'fetchDashboardCompanyData',
                graphqlArgs: {
                    labels__text: labelText,
                    after: endCursor
                }
            })
        );
    }, [endCursor]);

    return (
        <Button color="primary" disableElevation variant="contained" onClick={onClick} disabled={requestStatus === RequestStatus.REQUESTING}>
            Load More
        </Button>
    )
}

const UserAppPage = (props: IUserAppPageProps) => {
    const styleClasses = useStyles();

    const [searchText, setSearchText] = useState<string>('');
    const [isFiltering, setIsFiltering] = useState<boolean>(false);
    const [filteredCompanyList, setFilteredCompanyList] = useState<Array<Company>>([]);

    const endCursor = useSelector((state: IRootState) => state.interviewingCompany.graphqlEndCursor);
    const dispatch = useDispatch();
    useEffect(() => {
        if (endCursor === undefined) {
            // fetch companies that do not have label status yet, treat them as `target` and put them in target group
            dispatch(
                GroupedCompanyActionCreators["targetCompany"][CrudType.LIST][RequestStatus.TRIGGERED].action({
                    graphqlFunctionName: 'fetchDashboardCompanyData',
                    graphqlArgs: {
                        labels__isnull: true
                    }
                })
            );
    
            // fetch companies filter by their label status
            for (let labelText of Object.values(labelTypes)) {
                dispatch(
                    GroupedCompanyActionCreators[labelTypesMapToCompanyGroupTypes[labelText as labelTypes]][CrudType.LIST][RequestStatus.TRIGGERED].action({
                        graphqlFunctionName: 'fetchDashboardCompanyData',
                        graphqlArgs: {
                            labels__text: labelText
                        }
                    })
                );
            }
        }
    }, [endCursor])

    const searchFieldTextIsEmpty = () => {
        return Utilities.normalizeText(searchText) === '';
    }

    const filterCompanyByName = (name: string) => {
        const filteringName = Utilities.normalizeText(name);
        const allCompanies = Object.values(props.company.collection);

        setFilteredCompanyList(
            allCompanies.filter((company: Company) => Utilities.normalizeText(company.name).includes(filteringName))
        );
        // always switch on filering mode when filtering is triggered
        setIsFiltering(true);
    }

    const onSearchFieldChange = (event: React.FormEvent<HTMLInputElement>) => {
        setSearchText(event.currentTarget.value);
    }

    // switch off filtering mode if field becomes empty
    useEffect(() => {
        if (searchFieldTextIsEmpty()) {
            setIsFiltering(false);
        }
    }, [searchText]);

    const onSearchFieldKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key.toLowerCase() === 'enter') {
            !searchFieldTextIsEmpty() && filterCompanyByName(searchText);
        }
    }

    const onSearchFieldClear = () => {
        setSearchText('');
        setIsFiltering(false);
    }

    const allCompanies = Object.values(props.company.collection);

    // for searching feature
    const displayingCompanies: Array<Company> = (
        props.company.requestStatus !== RequestStatus.REQUESTING ? isFiltering ? filteredCompanyList : allCompanies : Array.from(Array(5))
    );
    displayingCompanies.sort((companyA: Company | undefined, companyB: Company | undefined) => {
        if (companyA && companyB) {
            // descending order, latest goes first
            return new Date(companyB.modified_at).getTime() - new Date(companyA.modified_at).getTime();
        }
        return 0;
    });

    return (
        <div>
            <div className={styles.UserAppPageHeader}>
                <Headline3>Your Organizations</Headline3>
                <Button
                    color="secondary"
                    variant="contained"
                    disableElevation
                    onClick={() => { props.history.push("/com-form/") }}
                >
                    <MaterialIcon icon="add" />
                    Add Organization
                </Button>
            </div>
            <TabContainer
                render={() => {
                    const allCompanyTab = (<TabContent label="All">
                        <div className={styles.companyListHeader}>
                            <TextField
                                className={styles.searchField}
                                label="Search Company Name"
                                outlined
                                leadingIcon={<MaterialIcon role="button" icon="search" />}
                                trailingIcon={searchText === '' ? undefined : <MaterialIcon role="button" icon="clear" />}
                                onTrailingIconSelect={onSearchFieldClear}
                            >
                                <Input
                                    type={InputFieldType.TEXT}
                                    inputType="input"
                                    onKeyDown={onSearchFieldKeyDown}
                                    onChange={onSearchFieldChange}
                                    value={searchText}
                                />
                            </TextField>
                        </div>
                        <MaterialUIList>
                            {
                                displayingCompanies.map(
                                    (company, index) => {
                                        return (
                                            <CompanyListItem
                                                key={company ? company.uuid : index}
                                                company={company}
                                                applications={company?.applications ? (company.applications as Array<IReference>).map((applicationUuid) => props.application.collection[applicationUuid]) : undefined}
                                            />
                                        )
                                    }
                                )
                            }
                        </MaterialUIList>
                    </TabContent>)

                    const groupCompanyTabs = Object.values(labelTypes).map((labelText: labelTypes, index) => {
                        return (
                            <TabContent key={index} label={`${labelText} (${Object.keys(props[labelTypesMapToCompanyGroupTypes[labelText]].collection).length})`}>
                                <div className={styles.companyListHeader}>
                                    <h1>{labelText}</h1>
                                </div>
                                <div>
                                    {
                                        Object.values(props[labelTypesMapToCompanyGroupTypes[labelText]].collection).map(
                                            (companyRef, index) => {
                                                const company = props.company.collection[companyRef.uuid];
                                                return company;
                                            }
                                        )
                                        .sort((companyA, companyB) => {
                                            // descending order, latest goes first
                                            return new Date(companyB.modified_at).getTime() - new Date(companyA.modified_at).getTime();
                                        })
                                        .map((company, index) => {
                                            const applications = company ? (company.applications as Array<IReference>).map((applicationUuid) => {
                                                return props.application.collection[applicationUuid];
                                            }) : undefined;

                                            return (
                                                <CompanyListItem
                                                    key={company ? company.uuid : index}
                                                    company={company}
                                                    applications={applications}
                                                />
                                            )
                                        })
                                    }
                                </div>
                                
                                <div className={styleClasses.loadMoreButtonContainer}>
                                    <LoadMoreButton labelText={labelText} />
                                </div>
                            </TabContent>
                        )
                    })

                    return [
                        allCompanyTab,
                        ...groupCompanyTabs
                    ]
                }}
            />
        </div>
    )
}

const mapStateToProps = (store: IRootState) => ({
    // prop: store.prop
    company: store.company,

    ...(Object.values(labelTypesMapToCompanyGroupTypes).reduce((accumulated, labelText) => ({
        ...accumulated,
        [labelText]: store[labelText]
    }), {}) as {[key in companyGroupTypes]: IObjectStore<Company>}),

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
