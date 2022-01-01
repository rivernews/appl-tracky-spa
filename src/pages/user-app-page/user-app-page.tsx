import React, { useCallback, useEffect, useState } from "react";
import { withRouter, RouteComponentProps } from "react-router-dom";

import { Utilities } from "../../utils/utilities";

/** Redux */
import { connect, useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import { IRootState } from "../../state-management/types/root-types";
import { IObjectAction, IObjectStore } from "../../state-management/types/factory-types";
import { InputFieldType } from "../../components/form-factory/form-base-field/form-base-field-meta";
// data models
import { Company, labelTypesMapToCompanyGroupTypes, companyGroupTypes, companyGroups } from "../../data-model/company/company";
import { labelTypes } from "../../data-model/label";
import { Application } from "../../data-model/application/application";

/** Components */
// mdc react icon
import MaterialIcon from "@material/react-material-icon";
import SearchIcon from "@material-ui/icons/Search";
import TargetIcon from "@material-ui/icons/AssistantPhoto";
import AppliedIcon from "@material-ui/icons/Check";
import InterviewingIcon from "@material-ui/icons/PhoneInTalk";
import ArchivedIcon from "@material-ui/icons/Archive";
// mdc react button
import MaterialUIList from "@material-ui/core/List";
import Button from '@material-ui/core/Button';
import Badge from "@material-ui/core/Badge";

// mdc-react input
import "@material/react-text-field/dist/text-field.css";
import TextField, { Input } from "@material/react-text-field";

import { TabContainer } from "../../components/tab/tab-container";
import { TabContent } from "../../components/tab/tab-content";

// objects
import { CompanyListItem } from "../../components/company/company-list-item";
import { CrudType, RequestStatus } from "../../utils/rest-api";

import { Headline3 } from '@material/react-typography';
import '@material/react-typography/dist/typography.css';

// styling
import styles from "./user-app-page.module.css";
import { IReference } from "../../data-model/base-model";
import { GroupedCompanyActionCreators, SearchCompanyActionCreators } from "../../state-management/action-creators/root-actions";
import { createStyles, makeStyles } from "@material-ui/core";
import { SetLastSearchTextOfUserAppPage } from "../../state-management/action-creators/user-app-page-actions";


const useStyles = makeStyles(() => {
    return createStyles({
        loadMoreButtonContainer: {
            display: 'flex',
            justifyContent: 'center',
            margin: '5vh 0 10vh 0'
        },
        centerVertically: {
            display: 'flex',
            alignItems: 'center'
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

interface IGroupedCompanyLoadMoreButtonProps {
    labelText: labelTypes
}

const GroupedCompanyLoadMoreButton = ({ labelText }: IGroupedCompanyLoadMoreButtonProps) => {
    const { graphqlEndCursor: endCursor, requestStatus } = useSelector((state: IRootState) => {
        return state[labelTypesMapToCompanyGroupTypes[labelText as labelTypes]];
    });
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

interface ISearchCompanyLoadMoreButtonProps {
    searchText: string
    disabled?: boolean
}

const SearchCompanyLoadMoreButton = ({ searchText, disabled }: ISearchCompanyLoadMoreButtonProps) => {
    const { graphqlEndCursor: endCursor, requestStatus } = useSelector((state: IRootState) => {
        return state.searchCompany;
    })
    const dispatch = useDispatch();
    const onClick = useCallback(() => {
        dispatch(
            SearchCompanyActionCreators[CrudType.LIST][RequestStatus.TRIGGERED].action({
                graphqlFunctionName: 'fetchDashboardCompanyData',
                graphqlArgs: {
                    name__icontains: searchText,
                    after: endCursor
                }
            })
        );
    }, [endCursor]);

    return (
        <Button color="primary" disableElevation variant="contained" onClick={onClick} disabled={requestStatus === RequestStatus.REQUESTING || disabled}>
            Load More
        </Button>
    )
}

const UserAppPage = (props: IUserAppPageProps) => {
    const styleClasses = useStyles();

    const isLogin = useSelector((state: IRootState) => state.auth.isLogin);

    const [lastSearchText, searchingRequestStatus] = useSelector((state: IRootState) => [
        state.userAppPage.lastSearchText,
        state.searchCompany.requestStatus
    ]);
    const [searchText, setSearchText] = useState<string>(lastSearchText);
    const [isFiltering, setIsFiltering] = useState<boolean>(false);

    const dispatch = useDispatch();

    // memorize last search text
    // so that when page mount again (re-visit), the search text still persist
    useEffect(() => {
        return () => {
            dispatch(SetLastSearchTextOfUserAppPage(searchText));
        }
    }, [searchText])

    // only fetch once when first visit home page;
    // avoid re-fetch first pagination of group companies when leaving and re-visiting home page again
    const anyGroupCompanyEndCursor = useSelector((state: IRootState) => state.interviewingCompany.graphqlEndCursor);
    useEffect(() => {
        if (anyGroupCompanyEndCursor === undefined && isLogin) {
            // fetch companies that do not have label status yet, treat them as `target` and put them in target group
            dispatch(
                GroupedCompanyActionCreators["targetCompany"][CrudType.LIST][RequestStatus.TRIGGERED].action({
                    graphqlFunctionName: 'fetchDashboardCompanyData',
                    graphqlArgs: {
                        labels__isnull: true
                    }
                })
            );

            // fetch companies by their label status, so each can be displayed separately in their tabs
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
    }, [anyGroupCompanyEndCursor, isLogin])

    const searchFieldTextIsEmpty = () => {
        return Utilities.normalizeText(searchText) === '';
    }

    const onSearchFieldChange = (event: React.FormEvent<HTMLInputElement>) => {
        setSearchText(event.currentTarget.value);
    }

    // switch off filtering mode if field becomes empty
    useEffect(() => {
        if (searchFieldTextIsEmpty()) {
            if (isFiltering) {
                setIsFiltering(false);
            }
        } else {
            if (!isFiltering) {
                setIsFiltering(true);
            }
        }
    }, [searchText]);

    const searchCompanyEndCursor = useSelector((state: IRootState) => state.searchCompany.graphqlEndCursor);

    const onSearchFieldKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
        switch (event.key.toLowerCase()) {
            case 'enter':
                if (!searchFieldTextIsEmpty()) {
                    dispatch(
                        SearchCompanyActionCreators[CrudType.LIST][RequestStatus.TRIGGERED].action({
                            graphqlFunctionName: 'fetchDashboardCompanyData',
                            graphqlArgs: {
                                name__icontains: searchText
                            },
                            triggerActionOptions: {
                                clearPreviousCollection: true
                            },
                            successCallback: () => {
                                dispatch(SetLastSearchTextOfUserAppPage(searchText));
                            }
                        })
                    )
                }
                break;
            case 'escape':
                onSearchFieldClear();
                break
        }
    }

    const onSearchFieldClear = () => {
        setSearchText('');
        setIsFiltering(false);
        // clear searchCompany redux (but don't delete company redux, which stores the actual company objects)
        dispatch(
            SearchCompanyActionCreators[CrudType.DELETE][RequestStatus.SUCCESS].action({
                clearAll: true
            })
        )
        dispatch(SetLastSearchTextOfUserAppPage(''));
    }

    // for searching feature
    const searchCompanies = useSelector((state: IRootState) => {
        return Object.values(state.searchCompany.collection).map(reference => props.company.collection[reference.uuid]);
    })

    return (
        <div>
            <div className={styles.UserAppPageHeader}>
                <Headline3>My Orgs</Headline3>
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
                    const allCompanyTab = (<TabContent label={
                        <Badge badgeContent={searchCompanies.length} color="secondary">
                            <div className={styleClasses.centerVertically}>
                                Search <SearchIcon />
                            </div>
                        </Badge>
                    }>
                        <div className={styles.companyListHeader}>
                            <TextField
                                className={styles.searchField}
                                label="Google, UCLA, ... etc"
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
                                    autoFocus
                                    disabled={searchingRequestStatus === RequestStatus.REQUESTING}
                                />
                            </TextField>
                        </div>
                        <MaterialUIList>
                            {
                                searchCompanies.map(
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
                        <div className={styleClasses.loadMoreButtonContainer}>
                            <SearchCompanyLoadMoreButton searchText={searchText} disabled={!isFiltering} />
                        </div>
                    </TabContent>)

                    const groupCompanyTabs = Object.values(labelTypes).map((labelText: labelTypes, index) => {
                        return (
                            <TabContent key={index} label={
                                <Badge badgeContent={Object.keys(props[labelTypesMapToCompanyGroupTypes[labelText]].collection).length}
                                    color="secondary"
                                >
                                    <div className={styleClasses.centerVertically}>
                                        {labelText}
                                        {labelText === labelTypes.TARGET ?
                                            <TargetIcon /> :
                                            labelText === labelTypes.APPLIED ?
                                            <AppliedIcon /> :
                                            labelText === labelTypes.INTERVIEWING ?
                                            <InterviewingIcon /> :
                                            labelText === labelTypes.ARCHIVED ?
                                            <ArchivedIcon /> : null}
                                    </div>
                                </Badge>
                            }>
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
                                    <GroupedCompanyLoadMoreButton labelText={labelText} />
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

    ...(companyGroups.reduce((accumulated, labelText) => ({
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
