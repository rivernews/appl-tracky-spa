import { Action } from "redux";
import { TabNames } from "../../data-model/label";

export interface IUserAppPageState {
    activeTabIndex: TabNames
}

export enum UserAppPageActionNames {
    SET_ACTIVE_TAB = "User app page set active tab",
}

export interface IUserAppPageSetActiveTabAction extends Action<UserAppPageActionNames.SET_ACTIVE_TAB> {
    type: typeof UserAppPageActionNames.SET_ACTIVE_TAB;
    activeTabIndex: TabNames;
}

export type TUserAppPageActions = 
    IUserAppPageSetActiveTabAction;
