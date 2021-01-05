import { Action } from "redux";
import { TabNames } from "../../data-model/label";

export interface IUserAppPageState {
    activeTabIndex: TabNames;
    lastSearchText: string;
}

export enum UserAppPageActionNames {
    SET_ACTIVE_TAB = 'User app page set active tab',
    SET_LAST_SEARCH_TEXT = 'User app page set last search text'
}

export interface IUserAppPageSetActiveTabAction extends Action<UserAppPageActionNames.SET_ACTIVE_TAB> {
    type: typeof UserAppPageActionNames.SET_ACTIVE_TAB;
    activeTabIndex: TabNames;
}

export interface IUserAppPageSetLastSearchTextAction extends Action<UserAppPageActionNames.SET_LAST_SEARCH_TEXT> {
    type: typeof UserAppPageActionNames.SET_LAST_SEARCH_TEXT;
    lastSearchText: string;
}

export type TUserAppPageActions = 
    IUserAppPageSetActiveTabAction |
    IUserAppPageSetLastSearchTextAction;
